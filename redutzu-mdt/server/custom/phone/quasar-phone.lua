CreateThread(function()
    if Config.PhoneScript ~= 'quasar-phone' then
        return
    end

    Config.Queries['search:players'] = 'CONCAT(firstname, \' \', lastname) LIKE :query OR charinfo LIKE :query'
    Config.Queries['search:cops'] = 'CONCAT(firstname, \' \', lastname) LIKE :query OR charinfo LIKE :query'

    function GetCitizenPhoneNumber(data)
        local charinfo = json.decode(data.charinfo)
        return charinfo.phone
    end

    function TransformCitizensPhone(results)
        for i = 1, #results do
            local player = results[i]
    
            if player.charinfo then
                local charinfo = json.decode(player.charinfo)
                player.phone_number = charinfo.phone
            end
        end
    end
end)