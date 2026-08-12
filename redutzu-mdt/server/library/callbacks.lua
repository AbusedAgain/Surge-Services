function RegisterCallback(callbackName, callbackFunction)
    RegisterServerEvent("rz-core:server_callback:" .. callbackName, function(...)
        local source = source
        callbackFunction(source, function(...)
            TriggerClientEvent("rz-core:client_callback:" .. callbackName, source, ...)
        end, ...)
    end)
end

function TriggerClientCallback(callbackName, targetPlayer, callbackFunction, ...)
    TriggerClientEvent("rz-core:server-client_callback:" .. callbackName, targetPlayer, ...)
    
    local eventHandler = RegisterNetEvent("rz-core:client-server_callback:" .. callbackName, function(...)
        if eventHandler then
            RemoveEventHandler(eventHandler)
        end
        callbackFunction(...)
    end)
    
    return eventHandler
end

-- Alternative implementation that maintains the original structure exactly:
function TriggerClientCallbackAlt(callbackName, targetPlayer, callbackFunction, ...)
    TriggerClientEvent("rz-core:server-client_callback:" .. callbackName, targetPlayer, ...)
    
    local eventHandlerId = false
    
    local callbackWrapper = function(...)
        if eventHandlerId ~= false then
            RemoveEventHandler(eventHandlerId)
        end
        callbackFunction(...)
    end
    
    eventHandlerId = RegisterNetEvent("rz-core:client-server_callback:" .. callbackName, callbackWrapper)
    
    return eventHandlerId
end