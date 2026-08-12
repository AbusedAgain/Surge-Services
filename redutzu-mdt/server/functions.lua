local Jobs = {}

function OpenMDT(source)
    local player = ESX.GetPlayerFromId(source)
    
    for _, jobName in ipairs(Config.WhitelistedJobs) do
        if player.job.name == jobName then
            TriggerClientEvent("rz-core:client:open-mdt", source)
            return
        end
    end
    
    Config.Notify(source, Config.Messages.not_allowed, "error")
end

function CloseMDT(source)
    TriggerClientEvent("rz-core:client:close-mdt", source)
end

RegisterNetEvent("rz-core:server:open-mdt", function()
    OpenMDT(source)
end)

exports("Open", OpenMDT)
exports("Close", CloseMDT)

function ParseResult(data, dataType)
    local validTypes = {
        players = true,
        cops = true,
        citizen = true
    }
    
    if dataType == "properties" then
        TransformPropertiesData(data)
    elseif validTypes[dataType] then
        TransformCitizensPhone(data)
    end
    
    return data
end

function announcement_middleware(source, announcement)
    local player = ESX.GetPlayerFromId(source)
    local playerName = Config.GetPlayerName(player)
    
    announcement.author = {
        name = string.format("%s %s", playerName.firstname, playerName.lastname),
        identifier = player.identifier
    }
    
    announcement.author = json.encode(announcement.author)
    return announcement
end

CreateThread(function()
    local jobs = Database.fetchAll({ table = Config.Tables.job })
    local grades = Database.fetchAll({ table = Config.Tables.grade })
    
    for _, job in ipairs(jobs) do
        Jobs[job.name] = job
        Jobs[job.name].grades = {}
    end
    
    for _, grade in ipairs(grades) do
        if Jobs[grade.job_name] then
            local gradeKey = tostring(grade.grade)
            Jobs[grade.job_name].grades[gradeKey] = grade
        end
    end
end)

function GetOnlineOfficers()
    local officers = {}
    local onlineOfficers = {}
    
    for _, jobName in ipairs(Config.WhitelistedJobs) do
        local jobPlayers = ESX.GetExtendedPlayers("job", jobName)
        mergeTables(onlineOfficers, jobPlayers)
    end
    
    for i, player in ipairs(onlineOfficers) do
        local playerName = Config.GetPlayerName(player)
        officers[i] = {
            identifier = player.identifier,
            name = string.format("%s %s", playerName.firstname, playerName.lastname),
            grade = player.job.grade_label
        }
    end
    
    return officers
end

function GetOfficers()
    local officers = {}
    
    local jobCondition = #Config.WhitelistedJobs > 0 and 
        "job = '" .. table.concat(Config.WhitelistedJobs, "' OR job = '") .. "'" or "1"
    
    local players = Database.fetchAll({
        table = Config.Tables.players,
        condition = jobCondition
    })
    
    for i, playerData in ipairs(players) do
        officers[i] = {
            identifier = playerData.identifier,
            name = string.format("%s %s", playerData.firstname, playerData.lastname),
            phone_number = GetCitizenPhoneNumber(playerData)
        }
        
        local job = Jobs[playerData.job]
        if job and job.grades then
            local gradeKey = tostring(playerData.job_grade)
            local gradeData = job.grades[gradeKey]
            
            officers[i].job = job.label
            officers[i].grade = gradeData and gradeData.label or "Grade not found"
        else
            print(string.format('Job "%s" not found in database for player with identifier: %s', 
                  playerData.job, playerData.identifier))
        end
        
        local esxPlayer = ESX.GetPlayerFromIdentifier(playerData.identifier)
        officers[i].online = esxPlayer ~= nil
    end
    
    return officers
end

function GetPlayerLicense(playerId)
    local identifiers = GetPlayerIdentifiers(playerId)
    
    for _, identifier in ipairs(identifiers) do
        if string.match(identifier, "license:") then
            return string.gsub(identifier, "license:", "")
        end
    end
end

function GetAuthorInformation(playerId)
    return {
        source = playerId,
        name = GetPlayerName(playerId),
        license = GetPlayerLicense(playerId)
    }
end

function SendEmbed(webhookType, embedData, fields)
    local webhookUrl = Config.Webhooks[webhookType]
    local headers = { ["Content-Type"] = "application/json" }
    
    local payload = {
        embeds = {
            {
                title = embedData.title,
                description = embedData.description,
                fields = fields,
                color = 16393509,
                timestamp = os.date("!%Y-%m-%dT%H:%M:%S"),
                footer = {
                    text = "Made with ♥ by Redutzu's Scripts"
                }
            }
        }
    }
    
    PerformHttpRequest(webhookUrl, nil, "POST", json.encode(payload), headers)
end