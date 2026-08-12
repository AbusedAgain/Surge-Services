Config = Config or {}

-- If you want other jobs to be able to access the MDT, add it to the list below;
-- Example: { 'police', 'lawyer' }
Config.WhitelistedJobs = { 'police' }

-- If you are not using one of the following scripts, you can leave the default value: default
Config.PhoneScript = 'lb-phone' -- default, quasar-phone, high-phone, road-phone, lb-phone, gksphone, custom

-- If you are not using one of the following scripts, you can leave the default value: default
-- If you want to disable this feature set the value to: none
Config.HousingSystem = 'default' -- default (esx-property 2.0) | custom | esx-property-old (The old one) | quasar-housing | loaf-housing | mf-housing | bcs_housing | myProperties | b-housing

-- If you don't find your dispatch script above, set the value to none
Config.DispatchSystem = 'cd_dispatch' -- none, linden_outlawalert, cd_dispatch, road-phone, qs-dispatch, custom

-- If you don't find your billing script above, leave the value "default"
Config.BillingScript = 'default' -- default, okokBilling, custom

-- If you are not using one of the following scripts, you can set the value to none
Config.LicenseSystem = 'default' -- none, default, bcs_license, custom

-- Enable this if you want to open the MDT using a command
Config.Command = {
    Enabled = true,
    Name = 'mdt',
    Description = 'Opens the MDT'
}

-- Enable this if you want to open the MDT using an item
Config.Item = {
    Enabled = false,
    Name = 'police_mdt'
    -- If you are using ox_inventory, go to ox_inventory/data/items.lua and add the item there
    -- If you are using the default esx inventory, go to the database and add the item to the items table
}

-- Enable this if you want to open the MDT using a keybind
Config.Keybind = {
    Enabled = true,
    Key = 'K'
}

-- Fines settings
Config.Fines = {
    Society = {
        Name = 'society_police' -- The name of the society
    },
    Split = {
        /*
            If you want to split the fine between the society and the officer,
            otherwise the percentage will go to the society
        */
        Enabled = false,
        Society = 70, -- The percentage of the fine that will go to the society
        Officer = 30 -- The percentage of the fine that will go to the officer
    },
    Function = function(online, identifier, amount, data, creator) -- Custom function to handle the fine 
        if online then
            SendPlayerBill(identifier, amount, data, creator)
        else -- If the player is offline, use the database
            local result = Database.fetchSingle({
                table = Config.Tables['players'],
                condition = Config.Queries['search:citizen'],
                parameters = {
                    query = identifier
                }
            })

            if result.accounts then
                local accounts = json.decode(result.accounts)
                local updated = concat(accounts, {
                    bank = tonumber(accounts.bank) - amount
                })

                return Database.execute({
                    query = 'UPDATE ' .. Config.Tables['players'] .. ' SET accounts = :accounts WHERE identifier = :identifier',
                    values = {
                        identifier = identifier,
                        accounts = json.encode(updated)
                    }
                })
            end
        end
    end
}

-- Charges settings
-- By default it uses esx_extendedjail but you can use a custom function
Config.Charges = {
    Function = function(online, identifier, months, data, creator) -- Custom function to handle the charges
        if online then -- If the player is online, use ESX functions
            local player = ESX.GetPlayerFromIdentifier(identifier)
            TriggerEvent('esx_extendedjail:jailplayer_server', player.source, months, 'prison')
        else -- If the player is offline, use the database
            local result = Database.fetchSingle({
                table = Config.Tables['players'],
                condition = Config.Queries['search:citizen'],
                parameters = {
                    query = players[i].identifier
                }
            })

            if result.arrested_time then
                local data = json.decode(result.arrested_time)
                local updated = concat(data, { prison = months })

                return Database.execute({
                    query = 'UPDATE ' .. Config.Tables['players'] .. ' SET arrested_time = :arrested_time WHERE identifier = :identifier',
                    values = {
                        identifier = players[i].identifier,
                        arrested_time = json.encode(updated)
                    }
                })
            end
        end
    end
}

-- I highly recommend not modifying if you don't know what you're doing
Config.Tables = {
    -- Players
    ['players'] = 'users',
    ['cops'] = 'users',
    ['citizen'] = 'users',
    ['job'] = 'jobs',
    ['grade'] = 'job_grades',
    ['licenses'] = 'user_licenses',

    -- Vehicles
    ['vehicles'] = 'owned_vehicles',
    ['vehicle'] = 'owned_vehicles',

    -- Incidents / Evidences / Warrants / Fines / Codes / Charges
    ['incidents'] = 'mdt_incidents',
    ['incident'] = 'mdt_incidents',
    ['evidences'] = 'mdt_evidences',
    ['evidence'] = 'mdt_evidences',
    ['warrants'] = 'mdt_warrants',
    ['warrant'] = 'mdt_warrants',
    ['fines'] = 'mdt_fines',
    ['fine'] = 'mdt_fines',
    ['codes'] = 'mdt_codes',
    ['code'] = 'mdt_codes',
    ['charges'] = 'mdt_jail',
    ['charge'] = 'mdt_jail',
    ['jail'] = 'mdt_jail',

    -- Other
    ['announcements'] = 'mdt_announcements',
    ['announcement'] = 'mdt_announcements',
    ['bolos'] = 'mdt_bolos',
    ['bolo'] = 'mdt_bolos'
}

-- Should not be modified!
Config.Queries = {
    -- Players
    ['search:players'] = 'CONCAT(firstname, \' \', lastname) LIKE :query OR phone_number LIKE :query',
    ['search:citizen'] = 'identifier = :query',
    ['search:cops'] = '(CONCAT(firstname, \' \', lastname) LIKE :query OR phone_number LIKE :query)',
   
    -- Licenses
    ['search:licenses'] = 'owner = :query',
    ['delete:license'] = 'owner = :owner AND type = :type',
    
    -- Vehicles
    ['search:vehicles'] = 'plate LIKE :query',
    ['search:vehicle'] = 'plate = :query',
    
    -- Incidents
    ['search:incidents'] = 'name LIKE :query',
    ['search:incident'] = 'id = :query',
    ['search:vehicle_incidents'] = 'vehicles LIKE :query',

    -- Evidences
    ['search:evidences'] = 'name LIKE :query OR id = :query',
    ['search:evidence'] = 'id = :query',

    -- Warrants
    ['search:warrants'] = 'reason LIKE :query OR id = :query',
    ['search:warrant'] = 'id = :query',
    ['search:active_warrants'] = 'done = 0',
    ['search:property_warrant'] = 'house = :query',

    -- Fines
    ['search:fines'] = 'name LIKE :query OR code LIKE :query',
    ['search:fine'] = 'id = :query',

    -- Codes
    ['search:codes'] = 'name LIKE :query OR code LIKE :query',
    ['search:code'] = 'id = :query',

    -- Charges
    ['search:charges'] = 'name LIKE :query',
    ['search:charge'] = 'id = :query',
    ['search:jail'] = 'name LIKE :query',

    -- Citizen
    ['search:citizen:incidents'] = 'players LIKE :query',
    ['search:citizen:evidences'] = 'players LIKE :query',
    ['search:citizen:warrants'] = 'players LIKE :query',
    ['search:citizen:vehicles'] = 'owner LIKE :query',
    ['search:citizen:properties'] = 'owner = :query',
    ['search:citizen:bolos'] = 'players LIKE :query',

    -- Announcements
    ['search:announcements'] = 'title LIKE :query OR content LIKE :query',
    ['search:announcement'] = 'id = :query',

    -- Bolos
    ['search:bolos'] = 'title LIKE :query OR vehicles LIKE :query OR players LIKE :query',
    ['search:bolo'] = 'id = :query',
    ['search:vehicle_bolos'] = 'vehicles LIKE :query'
}

Config.Columns = {
    ['incidents'] = 'id, name, createdAt',
    ['evidences'] = 'id, name, createdAt',
    ['warrants'] = 'id, reason, createdAt',
    ['announcements'] = nil,
    ['bolos'] = nil,
    ['players'] = nil,
    ['licenses'] = nil,
    ['vehicles'] = 'plate',
    ['properties'] = nil,
    ['fines'] = nil,
    ['codes'] = 'id, name, createdAt',
    ['charges'] = 'id, name, createdAt'
}

-- Custom Functions
Config.Notify = function(source, message, type)
    TriggerClientEvent('esx:showNotification', source, message, type)
end

-- Commands
Config.UseESXCommands = true -- If you want to use ESX commands, set this to true
Config.RegisterCommand = function(name, description, callback)
    if Config.UseESXCommands then
        ESX.RegisterCommand(name, 'user', function(player, args, error)
            callback(player)
        end, false, { help = description })    
    else
        RegisterCommand(name, function(source, args, raw)
            local player = ESX.GetPlayerFromId(source)
            callback(player)
        end, false)
    end
end

-- Items
Config.RegisterItem = function(name, callback)
    ESX.RegisterUsableItem(name, function(source)
        local player = ESX.GetPlayerFromId(source)
        callback(player)
    end)
end

-- ESX Functions

-- This works for ESX Legacy, If you are using an older version of ESX, you will need to change this
Config.GetPlayerName = function(player) -- player = ESX.GetPlayerFromId(source)
    return {
        firstname = player.variables.firstName,
        lastname = player.variables.lastName
    }
end

-- Permissions
-- https://docs.redutzu.com/resources/redutzu-mdt/configuration#permissions

Config.Permissions = {
    -- Template:
    -- [job] = { ...grades = { ...permissions } }
    ['police'] = {
        -- You can find these in the database (databse.job_grades)
        -- [grade] = { ...permissions }
        [0] = {
            'dashboard.view',
            'config.view',
            'alerts.view',
            'alerts.create',
            'alerts.take',
            'charges.view',
            'citizens.view',
            'citizens.edit',
            'codes.view',
            'evidences.view',
            'evidences.edit',
            'evidences.create',
            'fines.view',
            'houses.view',
            'incidents.view',
            'incidents.create',
            'incidents.edit',
            'officers.view',
            'vehicles.view',
            'vehicles.edit',
            'announcements.view',
            'bolos.view',
        },
        -- You have the same permissions as grade 0 + these
        [1] = {
            'charges.create',
            'codes.create',
            'fines.create',
            'warrants.view',
            'warrants.create',
            'warrants.edit',
            'bolos.create'
        },
        [2] = {
            'charges.edit',
            'charges.delete',
            'codes.edit',
            'codes.delete',
            'fines.edit',
            'fines.delete',
            'bolos.edit',
            'bolos.delete'
        },
        [3] = {
            'incidents.delete',
            'evidences.delete',
            'warrants.delete'
        },
        [4] = {
            'officers.edit',
            'announcements.create',
            'announcements.edit',
            'announcements.delete'
        }
    }
}

-- Discord Webhooks
-- https://docs.redutzu.com/resources/redutzu-mdt/configuration#webooks

Config.Webhooks = {
    ['incidents'] = false,
    ['evidences'] = false,
    ['warrants'] = false,
    ['fines'] = false,
    ['codes'] = false,
    ['charges'] = false,
    ['announcements'] = false,
    ['bolos'] = false,
    ['images'] = false, -- This webhook is required if you want to upload the images thru discord
    ['chat'] = false
}
