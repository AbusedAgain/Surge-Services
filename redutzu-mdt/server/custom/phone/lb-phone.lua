CreateThread(function()
    if Config.PhoneScript ~= 'lb-phone' then
        return
    end

    Config.Queries['search:players'] = 'CONCAT(firstname, \' \', lastname) LIKE :query'
    Config.Queries['search:cops'] = 'CONCAT(firstname, \' \', lastname) LIKE :query'
    
    function GetCitizenPhoneNumber(data)
        local phone = exports['lb-phone']:GetEquippedPhoneNumber(data.identifier)                
        return phone
    end

    function TransformCitizensPhone(results)
        for i = 1, #results do
            local player = results[i]
            local phone = exports['lb-phone']:GetEquippedPhoneNumber(player.identifier)
            player.phone_number = phone
        end
    end
end)