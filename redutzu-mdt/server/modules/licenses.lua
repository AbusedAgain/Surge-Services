local isLicenseSystemEnabled = Config.LicenseSystem == "default" or Config.LicenseSystem == "none"

-- Initialize license system functions
CreateThread(function()
    if not isLicenseSystemEnabled then
        return
    end

    -- Get all licenses for a player
    function GetPlayerLicenses(identifier)
        return Database.fetchAll({
            table = Config.Tables.licenses,
            columns = Config.Columns.licenses,
            condition = Config.Queries["search:licenses"],
            parameters = { query = identifier }
        })
    end

    -- Remove a specific license from a citizen
    function RemoveCitizenLicense(licenseData)
        local query = string.format("DELETE FROM %s WHERE %s", 
            Config.Tables.licenses, 
            Config.Queries["delete:license"]
        )
        
        Database.execute({
            query = query,
            values = {
                owner = licenseData.identifier,
                type = licenseData.type
            }
        })
    end
end)