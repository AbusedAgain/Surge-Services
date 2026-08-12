CreateThread(function()
    if Config.HousingSystem ~= 'loaf-housing' then
        return
    end

    Config.Tables['properties'] = 'loaf_properties'
    Config.Tables['property'] = 'loaf_properties'
    Config.Tables['owned_properties'] = 'loaf_properties'

    Config.Queries['search:properties'] = 'id LIKE :query'
    Config.Queries['search:property'] = 'id = :query'
    Config.Queries['search:property_name'] = 'id = :query'
    Config.Queries['search:owned_property'] = 'name = :query'
    Config.Queries['search:property_owner'] = 'owner = :query'

    function TransformPropertiesData(houses)
        for i = 1, #houses do
            houses[i] = concat(houses[i], {
                label = houses[i].id,
                name = houses[i].id
            })
        end
    end

    function GetWarrantHouse(name)
        local house = Database.fetchSingle({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:property_name'],
            parameters = { query = name }
        })

        return {
            label = house.id,
            id = house.id
        }
    end

    function GetHouseData(id)
        local house = Database.fetchSingle({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:property'],
            parameters = { query = id  }
        })

        local warrants = Database.fetchAll({
            table = Config.Tables['warrants'],
            condition = Config.Queries['search:property_warrant'],
            parameters = { query = house.id }
        })

        local loaf_house = exports['loaf_housing']:GetHouse(house.propertyid)

        return {
            id = house.propertyid,
            name = house.id,
            label = house.id,
            coords = {
                x = loaf_house.entrance.x,
                y = loaf_house.entrance.y,
                z = loaf_house.entrance.z
            },
            owner = house.owner,
            warrants = warrants
        }
    end

    function GetCitizenHouses(identifier)
        local results = {}
        local houses = Database.fetchAll({
            table = Config.Tables['owned_properties'],
            condition = Config.Queries['search:property_owner'],
            parameters = { query = identifier }
        })

        for i = 1, #houses do
            results[#results + 1] = {
                id = houses[i].id,
                name = ' '
            }
        end
        
        return results
    end
end)