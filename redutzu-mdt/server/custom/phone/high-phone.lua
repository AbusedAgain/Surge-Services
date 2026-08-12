CreateThread(function()
    if Config.PhoneScript ~= 'high-phone' then
        return
    end

    Config.Queries['search:players'] = 'CONCAT(firstname, \' \', lastname) LIKE :query OR phone LIKE :query'
    Config.Queries['search:cops'] = 'CONCAT(firstname, \' \', lastname) LIKE :query OR phone LIKE :query'

    function GetCitizenPhoneNumber(data)
        return data.phone
    end

    function TransformCitizensPhone(results)
        for i = 1, #results do
            local player = results[i]
            player.phone_number = player.phone
        end
    end
end)