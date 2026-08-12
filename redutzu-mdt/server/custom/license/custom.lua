CreateThread(function()
    if Config.LicenseSystem ~= 'custom' then
        return
    end

    -- You can delete these if your license script doesn't use it's own tables
    Config.Tables['licenses'] = 'table_name'
    Config.Columns['licenses'] = 'owner_column, type_column as type'

    Config.Queries['search:licenses'] = 'owner_column = :query'
    Config.Queries['delete:license'] = 'owner_column = :owner AND type_column = :type'

    -- Returns the licenses of a player
    ---@param identifier string # The identifier of the player
    ---@return table # [{ type: string, identifier: string, ...]
    function GetPlayerLicenses(identifier)
        local licenses = {
            { type = 'driver', identifier = identifier }
        }

        return licenses
    end

    -- Removes a license from a player
    ---@param data table # { identifier: string, type: string }
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