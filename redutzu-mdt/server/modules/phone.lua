CreateThread(function()
    if Config.PhoneScript ~= "default" and Config.PhoneScript ~= "none" then
        return
    end

    GetCitizenPhoneNumber = function(citizenData)
        if Config.PhoneScript == "none" then
            return 0
        end
        return citizenData.phone_number
    end

    TransformCitizensPhone = function(citizenData)
        return citizenData
    end
end)