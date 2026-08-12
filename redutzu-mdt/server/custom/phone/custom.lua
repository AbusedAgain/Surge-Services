CreateThread(function()
    if Config.PhoneScript ~= 'custom' then
        return
    end

    -- Returns the phone number of a player
    ---@param data table # { identifier: string, ...users_table_data }
    ---@return string # The phone number
    function GetCitizenPhoneNumber(data)
        local phone_number = 'phone_number'
        return phone_number
    end

    -- Replaces the default phone number of a player
    ---@param results table # [{ identifier: string, ...users_table_data }, ...]
    function TransformCitizensPhone(results)
        for i = 1, #results do
            local player = results[i]
            local phone_number = 'phone_number'
            
            player.phone_number = phone_number
        end
    end
end)
