CreateThread(function()
    if Config.DispatchSystem ~= 'qs-dispatch' then
        return
    end

    RegisterServerEvent('qs-dispatch:server:CreateDispatchCall', function(data)
        local player = source
        local jobs = arrayToSet(data.job)

        if jobs['police'] then
            TriggerClientEvent('rz-core:client:create-alert', player, 'Alert', data.message, data.callLocation)
        end
    end)
end)
