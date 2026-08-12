CreateThread(function()
    if Config.DispatchSystem ~= 'linden_outlawalert' then
        return
    end

    RegisterServerEvent('wf-alerts:svNotify', function(data)
        local player = source
        TriggerClientEvent('rz-core:client:create-alert', player, data.info, data.caller, data.coords)
    end)

    RegisterServerEvent('wf-alerts:svNotify911', function(message, caller)
        local player = source
        TriggerClientEvent('rz-core:client:create-alert', player, caller, message)
    end)
end)
