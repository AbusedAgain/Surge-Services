function HandleAlertTaken(alertData)
    if not alertData then
        Config.Notify("There was an error taking this alert.")
        return
    end

    local alertCoords = json.decode(alertData.coords)
    SetNewWaypoint(alertCoords.x, alertCoords.y)

    if Config.Alerts.Blip then
        local alertBlip = AddBlipForCoord(alertCoords.x, alertCoords.y, alertCoords.z)
        
        SetBlipSprite(alertBlip, Config.Alerts.BlipId)
        SetBlipDisplay(alertBlip, 4)
        SetBlipScale(alertBlip, 1.0)
        SetBlipColour(alertBlip, Config.Alerts.BlipColor)
        SetBlipAsShortRange(alertBlip, true)
        
        BeginTextCommandSetBlipName("STRING")
        AddTextComponentString(string.format("%s #%s", Config.Alerts.BlipLabel, alertData.id))
        EndTextCommandSetBlipName(alertBlip)

        -- Create fading blip effect
        CreateThread(function()
            while DoesBlipExist(alertBlip) do
                local currentAlpha = GetBlipAlpha(alertBlip)
                
                if currentAlpha <= Config.Alerts.BlipFadeOutRate then
                    RemoveBlip(alertBlip)
                    alertBlip = nil
                    break
                end
                
                SetBlipAlpha(alertBlip, currentAlpha - Config.Alerts.BlipFadeOutRate)
                Wait(Config.Alerts.BlipFadeOutInterval)
            end
        end)
    end
end

exports("CreateAlert", function(alertType, description, customCoords)
    TriggerEvent("rz-core:client:create-alert", alertType, description, customCoords)
end)

-- NUI Callbacks
RegisterNUICallback("GetAlerts", function(data, cb)
    TriggerCallback("GetAlerts", cb, data)
end)

RegisterNUICallback("TakeAlert", function(data, cb)
    SwitchNUI(false)
    TriggerCallback("TakeAlert", cb, data)
end)

RegisterNUICallback("CreateAlert", function(data, cb)
    TriggerCallback("CreateAlert", cb, data)
end)

-- Event Handlers
RegisterNetEvent("rz-core:client:take-alert", HandleAlertTaken)

RegisterNetEvent("rz-core:client:create-alert", function(alertType, description, customCoords)
    local playerPed = PlayerPedId()
    local alertCoords = customCoords or GetEntityCoords(playerPed)
    
    TriggerServerEvent("rz-core:server:sync-alert", {
        label = alertType,
        description = description,
        address = GetStreetLabel(alertCoords),
        coords = json.encode(alertCoords)
    })
end)

RegisterNetEvent("rz-core:client:sync-alert", function(alertsData)
    SendNUIMessage({
        action = "SetAlerts",
        data = alertsData
    })
end)