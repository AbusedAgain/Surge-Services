local function SendWebhookLog(eventName, title, description, fields, creator)
    if Config.Webhooks[eventName] then
        SendEmbed(eventName, {
            title = title,
            description = description
        }, fields or {})
    end
end

local function CreateOfficerDescription(officer)
    return string.format("**%s**\n(ID: **%s**, LICENSE: **%s**)",
        officer.name, tostring(officer.source), officer.license)
end

local function ProcessFines(finesData, players, incidentData, creator)
    if #finesData.list > 0 then
        local fineAmount = tonumber(finesData.amount)
        if fineAmount > 0 then
            for _, playerData in ipairs(players) do
                local player = ESX.GetPlayerFromIdentifier(playerData.identifier)
                local isOnline = player ~= nil
                
                Config.Fines.Function(isOnline, playerData.identifier, fineAmount, incidentData, creator)
                
                if Config.Fines.Split.Society > 0 then
                    TriggerEvent("esx_addonaccount:getSharedAccount", Config.Fines.Society.Name, function(account)
                        local societyCut = fineAmount * (Config.Fines.Split.Society / 100)
                        account.addMoney(societyCut)
                    end)
                end
                
                if Config.Fines.Split.Enabled and Config.Fines.Split.Officer > 0 then
                    local officer = ESX.GetPlayerFromId(creator.source)
                    local officerCut = fineAmount * (Config.Fines.Split.Officer / 100)
                    officer.addMoney(officerCut)
                end
            end
        end
    end
end

local function ProcessCharges(chargesData, players, incidentData, creator)
    if #chargesData.list > 0 then
        local chargeAmount = tonumber(chargesData.amount)
        if chargeAmount > 0 then
            for _, playerData in ipairs(players) do
                local player = ESX.GetPlayerFromIdentifier(playerData.identifier)
                local isOnline = player ~= nil
                Config.Charges.Function(isOnline, playerData.identifier, chargeAmount, incidentData, creator)
            end
        end
    end
end

-- Incidents Events
RegisterNetEvent("incidents:create", function(incidentData, creator)
    local players = json.decode(incidentData.players)
    local fines = json.decode(incidentData.fines)
    local jail = json.decode(incidentData.jail)
    
    ProcessFines(fines, players, incidentData, creator)
    ProcessCharges(jail, players, incidentData, creator)
    
    if Config.Webhooks.incidents then
        local cops = json.decode(incidentData.cops)
        local vehicles = json.decode(incidentData.vehicles)
        local evidences = json.decode(incidentData.evidences)
        
        local fields = {
            { name = "Name", value = incidentData.name, inline = true },
            { name = "Description", value = incidentData.description, inline = true },
            { name = "Citizens", value = string_map(players, { count = true, template = "{{firstname}} {{lastname}}", separator = "\n" }), inline = true },
            { name = "Cops", value = string_map(cops, { count = true, template = "{{firstname}} {{lastname}}", separator = "\n" }), inline = true }
        }
        
        if #vehicles > 0 then
            fields[#fields + 1] = {
                name = "Vehicles",
                value = string_map(vehicles, { count = true, template = "{{plate}}", separator = "\n" }),
                inline = true
            }
        end
        
        if #evidences > 0 then
            fields[#fields + 1] = {
                name = "Evidences",
                value = string_map(evidences, { count = true, separator = "\n" }),
                inline = true
            }
        end
        
        if #fines.list > 0 then
            fields[#fields + 1] = {
                name = replace_all("Fines ({{amount}}$) (reduction: {{reduction}}%)", fines),
                value = string_map(fines.list, { count = true, template = "{{name}} ({{amount}}$)", separator = "\n" }),
                inline = true
            }
        end
        
        if #jail.list > 0 then
            fields[#fields + 1] = {
                name = replace_all("Charges ({{amount}} months) (reduction: {{reduction}}%)", jail),
                value = string_map(jail.list, { count = true, template = "{{name}} ({{time}} months)", separator = "\n" }),
                inline = true
            }
        end
        
        SendWebhookLog("incidents", "New incident", 
            "Incident created by " .. CreateOfficerDescription(creator), fields)
    end
end)

RegisterNetEvent("incidents:delete", function(incidentId, officer)
    SendWebhookLog("incidents", "Incident deleted | ID: " .. tostring(incidentId),
        "Incident deleted by " .. CreateOfficerDescription(officer))
end)

RegisterNetEvent("incidents:update", function(incidentData, incidentId, officer)
    local fields = {
        { name = "Description", value = incidentData.description, inline = true }
    }
    
    SendWebhookLog("incidents", "Incident Edited | ID: " .. incidentId,
        "Incident modified by " .. CreateOfficerDescription(officer), fields)
end)

-- Evidences Events
RegisterNetEvent("evidences:create", function(evidenceData, creator)
    if Config.Webhooks.evidences then
        local players = json.decode(evidenceData.players)
        local images = json.decode(evidenceData.images)
        
        for i, image in ipairs(images) do
            images[i] = { link = image }
        end
        
        local fields = {
            { name = "Name", value = evidenceData.name, inline = true },
            { name = "Description", value = evidenceData.description, inline = true },
            { name = "Citizens", value = string_map(players, { count = true, template = "{{firstname}} {{lastname}}", separator = "\n" }), inline = true },
            { name = "Images", value = string_map(images, { count = true, template = "[Click Here]({{link}})", separator = "\n" }), inline = true }
        }
        
        SendWebhookLog("evidences", "New evidence",
            "Evidence created by " .. CreateOfficerDescription(creator), fields)
    end
end)

RegisterNetEvent("evidences:delete", function(evidenceId, officer)
    SendWebhookLog("evidences", "Evidence deleted | ID: " .. tostring(evidenceId),
        "Evidence deleted by " .. CreateOfficerDescription(officer))
end)

RegisterNetEvent("evidences:update", function(evidenceData, evidenceId, officer)
    local fields = {
        { name = "Description", value = evidenceData.description, inline = true }
    }
    
    SendWebhookLog("evidences", "Evidence Edited | ID: " .. evidenceId,
        "Evidence modified by " .. CreateOfficerDescription(officer), fields)
end)

-- Warrants Events
RegisterNetEvent("warrants:create", function(warrantData, creator)
    if Config.Webhooks.warrants then
        local players = json.decode(warrantData.players)
        
        local fields = {
            { name = "Reason", value = warrantData.reason, inline = true },
            { name = "Description", value = warrantData.description, inline = true },
            { name = "Warrant Type", value = warrantData.wtype, inline = true },
            { name = "Citizens", value = string_map(players, { count = true, template = "{{firstname}} {{lastname}}", separator = "\n" }), inline = true },
            { name = "House", value = isStrEmpty(warrantData.house) and "None" or warrantData.house, inline = true }
        }
        
        SendWebhookLog("warrants", "New warrant",
            "Warrant created by " .. CreateOfficerDescription(creator), fields)
    end
end)

RegisterNetEvent("warrants:delete", function(warrantId, officer)
    SendWebhookLog("warrants", "Warrant deleted | ID: " .. tostring(warrantId),
        "Warrant deleted by " .. CreateOfficerDescription(officer))
end)

RegisterNetEvent("warrants:update", function(warrantData, warrantId, officer)
    local fields = {
        { name = "Warrant done", value = warrantData.done > 0 and "True" or "False", inline = true },
        { name = "Description", value = warrantData.description, inline = true }
    }
    
    SendWebhookLog("warrants", "Warrant Edited | ID: " .. warrantId,
        "Warrant modified by " .. CreateOfficerDescription(officer), fields)
end)

-- Fines Events
RegisterNetEvent("fines:create", function(fineData, creator)
    local fields = {
        { name = "Name", value = fineData.name, inline = true },
        { name = "Code", value = fineData.code, inline = true },
        { name = "Amount", value = fineData.amount, inline = true }
    }
    
    SendWebhookLog("fines", "New fine",
        "Fine created by " .. CreateOfficerDescription(creator), fields)
end)

RegisterNetEvent("fines:delete", function(fineId, officer)
    SendWebhookLog("fines", "Fine deleted | ID: " .. tostring(fineId),
        "Fine deleted by " .. CreateOfficerDescription(officer))
end)

RegisterNetEvent("fines:update", function(fineData, fineId, officer)
    local fields = {
        { name = "Name", value = fineData.name, inline = true },
        { name = "Code", value = fineData.code, inline = true },
        { name = "Amount", value = fineData.amount, inline = true }
    }
    
    SendWebhookLog("fines", "Fine Edited | ID: " .. fineId,
        "Fine modified by " .. CreateOfficerDescription(officer), fields)
end)

-- Codes Events
RegisterNetEvent("codes:create", function(codeData, creator)
    local fields = {
        { name = "Name", value = codeData.name, inline = true },
        { name = "Code", value = codeData.code, inline = true }
    }
    
    SendWebhookLog("codes", "New code",
        "Code created by " .. CreateOfficerDescription(creator), fields)
end)

RegisterNetEvent("codes:delete", function(codeId, officer)
    SendWebhookLog("codes", "Code deleted | ID: " .. tostring(codeId),
        "Code deleted by " .. CreateOfficerDescription(officer))
end)

RegisterNetEvent("codes:update", function(codeData, codeId, officer)
    local fields = {
        { name = "Name", value = codeData.name, inline = true },
        { name = "Code", value = codeData.code, inline = true }
    }
    
    SendWebhookLog("codes", "Code Edited | ID: " .. codeId,
        "Code modified by " .. CreateOfficerDescription(officer), fields)
end)

-- Charges Events
RegisterNetEvent("charges:create", function(chargeData, creator)
    local fields = {
        { name = "Name", value = chargeData.name, inline = true },
        { name = "Time", value = chargeData.time .. " months", inline = true }
    }
    
    SendWebhookLog("charges", "New charge",
        "Charge created by " .. CreateOfficerDescription(creator), fields)
end)

RegisterNetEvent("charges:delete", function(chargeId, officer)
    SendWebhookLog("charges", "Charge deleted | ID: " .. tostring(chargeId),
        "Charge deleted by " .. CreateOfficerDescription(officer))
end)

RegisterNetEvent("charges:update", function(chargeData, chargeId, officer)
    local fields = {
        { name = "Name", value = chargeData.name, inline = true },
        { name = "Time", value = tostring(chargeData.time) .. " months", inline = true }
    }
    
    SendWebhookLog("charges", "Charge Edited | ID: " .. chargeId,
        "Charge modified by " .. CreateOfficerDescription(officer), fields)
end)

-- Announcements Events
RegisterNetEvent("announcements:create", function(announcementData, creator)
    local fields = {
        { name = "Title", value = announcementData.title, inline = true },
        { name = "Pinned", value = (announcementData.pinned or 0) > 0 and "Yes" or "No", inline = true },
        { name = "Content", value = "```html\n" .. string.sub(announcementData.content, 1, 1000) .. "\n...```", inline = false }
    }
    
    SendWebhookLog("announcements", "New announcement",
        "Announcement created by " .. CreateOfficerDescription(creator), fields)
end)

RegisterNetEvent("announcements:delete", function(announcementId, officer)
    SendWebhookLog("announcements", "Announcement deleted | ID: " .. tostring(announcementId),
        "Announcement deleted by " .. CreateOfficerDescription(officer))
end)

RegisterNetEvent("announcements:update", function(announcementData, announcementId, officer)
    local fields = {}
    
    if announcementData.content ~= nil then
        fields[#fields + 1] = {
            name = "Content",
            value = "```html\n" .. string.sub(announcementData.content, 1, 1000) .. "\n...```",
            inline = false
        }
    end
    
    if announcementData.pinned ~= nil then
        fields[#fields + 1] = {
            name = "Pinned",
            value = announcementData.pinned > 0 and "Yes" or "No",
            inline = false
        }
    end
    
    SendWebhookLog("announcements", "Announcement Edited | ID: " .. announcementId,
        "Announcement modified by " .. CreateOfficerDescription(officer), fields)
end)

-- BOLOs Events
RegisterNetEvent("bolos:create", function(boloData, creator)
    if Config.Webhooks.bolos then
        local players = json.decode(boloData.players)
        local vehicles = json.decode(boloData.vehicles)
        
        local fields = {
            { name = "Title", value = boloData.title, inline = true },
            { name = "Description", value = boloData.description, inline = true },
            { name = "Type", value = boloData.bolo_type, inline = true },
            { name = "Citizens", value = string_map(players, { count = true, template = "{{firstname}} {{lastname}}", separator = "\n" }), inline = true },
            { name = "Vehicles", value = string_map(vehicles, { count = true, template = "{{plate}}", separator = "\n" }), inline = true }
        }
        
        SendWebhookLog("bolos", "New BOLO",
            "Bolo created by " .. CreateOfficerDescription(creator), fields)
    end
end)

RegisterNetEvent("bolos:delete", function(boloId, officer)
    SendWebhookLog("bolos", "BOLO deleted | ID: " .. tostring(boloId),
        "Bolo deleted by " .. CreateOfficerDescription(officer))
end)

RegisterNetEvent("bolos:update", function(boloData, boloId, officer)
    local fields = {
        { name = "Title", value = boloData.title, inline = true },
        { name = "Description", value = boloData.description, inline = true }
    }
    
    SendWebhookLog("bolos", "BOLO Edited | ID: " .. boloId,
        "Bolo modified by " .. CreateOfficerDescription(officer), fields)
end)