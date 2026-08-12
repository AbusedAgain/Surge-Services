CreateThread(function()
    if Config.LicenseSystem ~= 'bcs_license' then
        return
    end
    
    Config.Tables['licenses'] = 'licenses'
    Config.Columns['licenses'] = 'owner, license as type'

    Config.Queries['search:licenses'] = 'owner = :query'
    Config.Queries['delete:license'] = 'owner = :owner AND license = :type'
    
    function GetPlayerLicenses(identifier)
        local licenses = Database.fetchAll({
            table = Config.Tables['licenses'],
            columns = Config.Columns['licenses'],
            condition = Config.Queries['search:licenses'],
            parameters = { query = identifier }
        })

        return licenses
    end

    function RemoveCitizenLicense(data)
        Database.execute({
            query = 'DELETE FROM ' .. Config.Tables['licenses'] .. ' WHERE ' .. Config.Queries['delete:license'],
            values = {
                owner = data.identifier,
                type = data.type
            }
        })
    end
end)