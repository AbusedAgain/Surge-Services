-- Toggle NUI interface visibility
function SwitchNUI(visible)
    ToggleAnimation(visible)
    SetNuiFocus(visible, visible)
    SendNUIMessage({
        action = "setVisible",
        data = visible
    })
end

-- Generic callback handler for simple operations
local function CreateGenericCallbackHandler(callbackName)
    return function(data, cb)
        TriggerCallback(callbackName, cb, data)
    end
end

-- Register generic NUI callbacks
local genericCallbacks = {
    "search", "create", "update", "delete", "GetDashboardData", 
    "GetOfficers", "GetCitizenData", "RemoveCitizenLicense", 
    "GetWarrantHouse", "GetPermissions", "GetOfficersPosition"
}

for _, callbackName in ipairs(genericCallbacks) do
    RegisterNUICallback(callbackName, CreateGenericCallbackHandler(callbackName))
end

-- Get vehicle data with label processing
RegisterNUICallback("GetVehicleData", function(data, cb)
    local vehicleModel = GetDisplayNameFromVehicleModel(data.model)
    
    TriggerCallback("GetVehicleData", function(vehicleData)
        local result = {
            label = GetLabelText(vehicleModel),
            incidents = vehicleData.incidents,
            bolos = vehicleData.bolos
        }
        cb(result)
    end, data.plate)
end)

-- Get house data with street information
RegisterNUICallback("GetHouseData", function(data, cb)
    TriggerCallback("GetHouseData", function(houseData)
        if houseData.coords then
            houseData.street = GetStreetLabel(houseData.coords) or false
        end
        cb(houseData)
    end, data)
end)

-- Set waypoint from coordinates
RegisterNUICallback("SetWaypoint", function(data, cb)
    local coords = json.decode(data)
    SetNewWaypoint(coords.x, coords.y)
    cb({})
end)

-- Show/hide NUI interface
RegisterNUICallback("show", function(data, cb)
    SwitchNUI(true)
    cb({})
end)

RegisterNUICallback("hide", function(data, cb)
    SwitchNUI(false)
    cb({})
end)

-- Client events for opening/closing MDT
RegisterNetEvent("rz-core:client:open-mdt", function()
    SwitchNUI(true)
end)

RegisterNetEvent("rz-core:client:close-mdt", function()
    SwitchNUI(false)
end)

-- Initialize Discord image API if enabled
CreateThread(function()
    if Upload.Method == "discord" then
        TriggerCallback("GetImageAPI", function(apiData)
            Upload.Methods.discord.link = apiData.link
        end)
    end
end)

-- Register keybind for opening MDT
TriggerCallback("GetKeybind", function(keybindConfig)
    if keybindConfig.Enabled then
        RegisterCommand("+mdt_keybind", function()
            TriggerServerEvent("rz-core:server:open-mdt")
        end, false)

        RegisterKeyMapping("+mdt_keybind", "This command is not created to be used in chat!", "keyboard", keybindConfig.Key)
    end
end)