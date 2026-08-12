CreateThread(function()
    if Config.PhoneScript ~= 'road-phone' then
        return
    end

    function GetCitizenPhoneNumber(data)
        return data.phone_number
    end

    function TransformCitizensPhone(results)
        return results
    end
end)