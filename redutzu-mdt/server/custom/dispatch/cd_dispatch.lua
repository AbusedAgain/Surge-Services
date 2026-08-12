CreateThread(function()
    if Config.DispatchSystem ~= 'cd_dispatch' then
        return
    end
    
    RegisterServerEvent('cd_dispatch:AddNotification', function(data)
        local player = source
        local jobs = arrayToSet(data.job_table)
        
        if jobs['police'] then
            TriggerClientEvent('rz-core:client:create-alert', player, data.title, data.message)
        end
    end)
end)