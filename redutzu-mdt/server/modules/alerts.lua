Alerts = {}

-- Export for creating alerts
exports("CreateAlert", function(playerId, title, description, coords)
    TriggerClientEvent("rz-core:client:create-alert", playerId, title, description, coords)
end)

-- Check if player has whitelisted job
local function HasWhitelistedJob(player)
    for _, whitelistedJob in ipairs(Config.WhitelistedJobs) do
        if player.job.name == whitelistedJob then
            return true
        end
    end
    return false
end

-- Get all players with whitelisted jobs
local function GetWhitelistedPlayers()
    local players = ESX.GetPlayers() or ESX.Players
    local whitelistedPlayers = {}
    
    for _, playerId in ipairs(players) do
        local player = ESX.GetPlayerFromId(playerId)
        if player and HasWhitelistedJob(player) then
            table.insert(whitelistedPlayers, playerId)
        end
    end
    
    return whitelistedPlayers
end

-- Sync alerts with all whitelisted players
local function SyncAlerts(newAlert)
    local whitelistedPlayers = GetWhitelistedPlayers()
    
    -- Add new alert if provided
    if newAlert then
        local alertData = {
            id = #Alerts + 1,
            label = newAlert.label,
            description = newAlert.description,
            address = newAlert.address,
            coords = newAlert.coords
        }
        table.insert(Alerts, alertData)
    end
    
    -- Sync with all whitelisted players
    for _, playerId in ipairs(whitelistedPlayers) do
        TriggerClientEvent("rz-core:client:sync-alert", playerId, Alerts)
    end
end

-- Callback: Get all alerts
RegisterCallback("GetAlerts", function(source, cb)
    cb(Alerts)
end)

-- Callback: Take/remove an alert
RegisterCallback("TakeAlert", function(source, cb, data)
    -- Notify client about the taken alert
    TriggerClientEvent("rz-core:client:take-alert", source, Alerts[data.id])
    
    -- Remove the alert
    table.remove(Alerts, data.id)
    
    -- Sync updated alerts
    TriggerEvent("rz-core:server:sync-alert")
    
    cb("ok")
end)

-- Callback: Create a new alert
RegisterCallback("CreateAlert", function(source, cb, data)
    TriggerClientEvent("rz-core:client:create-alert", source, data.title, data.description)
    cb("ok")
end)

-- Event: Sync alerts (with optional new alert)
RegisterNetEvent("rz-core:server:sync-alert", function(newAlert)
    SyncAlerts(newAlert)
end)