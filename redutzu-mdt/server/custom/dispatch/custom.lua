CreateThread(function()
    if Config.DispatchSystem ~= 'custom' then
        return
    end

    --[[
        Example:

        RegisterServerEvent('dispatch_event_name', function(...args)
            local player = source
            TriggerClientEvent('rz-core:client:create-alert', player, 'Alert title', 'Alert message')
        end)
    --]]
end)