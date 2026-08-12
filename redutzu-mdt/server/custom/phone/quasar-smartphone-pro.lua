CreateThread(function()
    if Config.PhoneScript ~= 'quasar-smartphone-pro' then
        return
    end

    local function GetPhoneNumberOffline(identifier)
        local response = MySQL.Sync.fetchSingle('SELECT phone FROM phone_backups WHERE owner = ?', { identifier })
        return response and response.phone or 'unknown'
    end

    function GetCitizenPhoneNumber(data)
        local phoneNumber = exports['qs-smartphone-pro']:GetPhoneNumberFromIdentifier(data.identifier)

        if not phoneNumber then
            local phone = GetPhoneNumberOffline(data.identifier)
            phoneNumber = phone
        end

        return phoneNumber
    end

    function TransformCitizensPhone(results)
        for i = 1, #results do
            local player = results[i]
            local phoneNumber = exports['qs-smartphone-pro']:GetPhoneNumberFromIdentifier(player.identifier)

            if not phoneNumber then
                local phone = GetPhoneNumberOffline(player.identifier)
                phoneNumber = phone
            end
            
            player.phone_number = phoneNumber
        end
    end
end)