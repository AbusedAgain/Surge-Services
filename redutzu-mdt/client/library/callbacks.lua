function RegisterClientCallback(callbackName, callbackFunction)
    RegisterNetEvent("rz-core:server-client_callback:" .. callbackName, function(...)
        callbackFunction(function(...)
            TriggerServerEvent("rz-core:client-server_callback:" .. callbackName, ...)
        end, ...)
    end)
end

function TriggerServerCallback(callbackName, callbackFunction, ...)
    TriggerServerEvent("rz-core:server_callback:" .. callbackName, ...)
    
    local eventHandler = RegisterNetEvent("rz-core:client_callback:" .. callbackName, function(...)
        callbackFunction(...)
    end)
    
    return eventHandler
end

function TriggerCallback(callbackName, callbackFunction, ...)
    local eventHandler = false
    
    local callbackWrapper = function(...)
        if eventHandler ~= false then
            RemoveEventHandler(eventHandler)
        end
        callbackFunction(...)
    end
    
    eventHandler = TriggerServerCallback(callbackName, callbackWrapper, ...)
    
    return eventHandler
end