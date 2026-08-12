local citizenCount = 0
local vehicleCount = 0

RegisterCallback("search", function(source, cb, data)
    local tableName = Config.Tables[data.type]
    
    if not tableName then
        local alternativeFunction = _G["alternative_" .. data.type]
        if alternativeFunction then
            alternativeFunction(data, cb)
        else
            error("Table " .. data.type .. " does not exist")
        end
        return
    end

    local queryFunction = data.single and Database.fetchSingle or Database.fetchAll
    
    local result = queryFunction({
        table = tableName,
        condition = Config.Queries["search:" .. data.type],
        sort = data.sort,
        columns = Config.Columns[data.type],
        parameters = { query = data.query },
        limit = data.limit or 0
    })

    result = ParseResult(result, data.type)
    cb(result)
end)

RegisterCallback("create", function(source, cb, data)
    local tableName = Config.Tables[data.type]
    
    if not tableName then
        error("Table " .. data.type .. " does not exist")
        return
    end

    if data.dataMiddleware and _G[data.dataMiddleware] then
        data.data = _G[data.dataMiddleware](source, data.data)
    end

    local result = Database.insert({
        table = tableName,
        values = data.data
    })

    if data.event then
        local author = GetAuthorInformation(source)
        TriggerEvent(data.event, data.data, author)
    end

    cb({
        status = result ~= nil,
        data = result
    })
end)

RegisterCallback("update", function(source, cb, data)
    local tableName = Config.Tables[data.type]
    local identifierType = data.identifierType or "id"
    local setClause = ""

    if not tableName then
        error("Table " .. data.type .. " does not exist")
        return
    end

    for key, _ in pairs(data.values) do
        setClause = setClause .. key .. " = :" .. key .. ", "
    end

    local whereParams = { [identifierType] = data[identifierType] }
    local queryParams = concat(whereParams, data.values)

    local result = Database.execute({
        query = "UPDATE " .. tableName .. " SET " .. setClause:sub(1, -3) .. 
                " WHERE " .. identifierType .. " = :" .. identifierType,
        values = queryParams
    })

    if data.event then
        local author = GetAuthorInformation(source)
        TriggerEvent(data.event, data.values, data[identifierType], author)
    end

    cb({ status = result ~= nil })
end)

RegisterCallback("delete", function(source, cb, data)
    local tableName = Config.Tables[data.type]
    
    if not tableName then
        error("Table " .. data.type .. " does not exist")
        return
    end

    local result = Database.execute({
        query = "DELETE FROM " .. tableName .. " WHERE id = :id",
        values = { id = data.id }
    })

    if data.event then
        local author = GetAuthorInformation(source)
        TriggerEvent(data.event, data.id, author)
    end

    cb(result ~= nil)
end)

CreateThread(function()
    while true do
        local stats = Database.fetchAll({
            table = "dual",
            columns = "(SELECT COUNT(*) FROM " .. Config.Tables.players .. ") AS citizens, " ..
                     "(SELECT COUNT(*) FROM " .. Config.Tables.vehicles .. ") AS vehicles"
        })

        if stats[1] then
            citizenCount = stats[1].citizens
            vehicleCount = stats[1].vehicles
        end

        Wait(300000) -- 5 minutes
    end
end)

RegisterCallback("GetDashboardData", function(source, cb)
    local player = ESX.GetPlayerFromId(source)
    local playerName = Config.GetPlayerName(player)

    local dashboardData = {
        name = playerName,
        job = {
            label = player.job.label,
            grade = player.job.grade_label
        },
        identifier = player.identifier,
        officers = GetOnlineOfficers(),
        citizens = citizenCount,
        vehicles = vehicleCount,
        alerts = #Alerts
    }

    cb(dashboardData)
end)

RegisterCallback("GetOfficers", function(source, cb)
    cb(GetOfficers())
end)

RegisterCallback("GetOfficersPosition", function(source, cb)
    local officers = {}
    local positions = {}

    for _, jobName in ipairs(Config.WhitelistedJobs) do
        local jobPlayers = ESX.GetExtendedPlayers("job", jobName)
        mergeTables(officers, jobPlayers)
    end

    for _, officer in ipairs(officers) do
        local ped = GetPlayerPed(officer.source)
        local coords = GetEntityCoords(ped)
        local officerName = Config.GetPlayerName(officer)

        positions[#positions + 1] = {
            name = officerName,
            coords = json.encode(coords)
        }
    end

    cb(positions)
end)

RegisterCallback("GetVehicleData", function(source, cb, plate)
    local incidents = Database.fetchAll({
        table = Config.Tables.incidents,
        columns = "id, name, createdAt",
        condition = Config.Queries["search:vehicle_incidents"],
        parameters = { query = "%" .. plate .. "%" }
    })

    local bolos = Database.fetchAll({
        table = Config.Tables.bolos,
        columns = "id, title, status, createdAt",
        condition = Config.Queries["search:vehicle_bolos"],
        parameters = { query = "%" .. plate .. "%" }
    })

    cb({
        incidents = incidents,
        bolos = bolos
    })
end)

RegisterCallback("GetPermissions", function(source, cb, data)
    local player = ESX.GetPlayerFromId(source)
    local jobName = player.job.name
    local jobGrade = player.job.grade
    local permissions = {}

    for grade = jobGrade, 0, -1 do
        local jobPermissions = Config.Permissions[jobName] or {}
        local gradePermissions = jobPermissions[grade] or {}

        for _, permission in ipairs(gradePermissions) do
            permissions[#permissions + 1] = permission
        end
    end

    cb(permissions)
end)

RegisterCallback("GetImageAPI", function(source, cb)
    cb({ link = Config.Webhooks.images })
end)

-- Command Registration
if Config.Command.Enabled then
    Config.RegisterCommand(Config.Command.Name, Config.Command.Description, function(xPlayer)
        OpenMDT(xPlayer.source)
    end)
end

-- Item Registration
if Config.Item.Enabled then
    Config.RegisterItem(Config.Item.Name, function(xPlayer)
        OpenMDT(xPlayer.source)
    end)
end

-- Mugshot Registration
if Config.Mugshot.Enabled then
    Config.RegisterItem(Config.Mugshot.Name, function(xPlayer)
        local playerName = Config.GetPlayerName(xPlayer)
        TriggerClientEvent("rz-core:client:mugshot", xPlayer.source, playerName)
    end)
end

RegisterCallback("GetKeybind", function(source, cb)
    cb(Config.Keybind)
end)

-- Startup and Version Check
CreateThread(function()
    print("^9 ")
    print("  _____          _       _                    __  __ _____ _______ ")
    print(" |  __ \\        | |     | |                  |  \\/  |  __ \\__   __|")
    print(" | |__) |___  __| |_   _| |_ _____   _ ______| \\  / | |  | | | |   ")
    print(" |  _  // _ \\/ _` | | | | __|_  / | | |______| |\\/| | |  | | | |   ")
    print(" | | \\ \\  __/ (_| | |_| | |_ / /| |_| |      | |  | | |__| | | |   ")
    print(" |_|  \\_\\___|\\__,_|\\__,_|\\__/___|\\__,_|      |_|  |_|_____/  |_|")
    print("^0 ")

    local resourceName = GetCurrentResourceName()
    local currentVersion = GetResourceMetadata(resourceName, "version", 0)
    local versionUrl = "https://raw.githubusercontent.com/redutzu/versions/main/mdt.txt"

    PerformHttpRequest(versionUrl, function(error, response, headers)
        if not response then
            print("^1[Redutzu-MDT] Version check is disabled, most likely the api has some issues right now!^0")
            return
        end

        local currentVersionNum = tonumber(currentVersion:gsub("%.", ""))
        local latestVersionNum = tonumber(response:gsub("%.", ""))

        if currentVersionNum < latestVersionNum then
            print(string.format("^1[Redutzu-MDT] An update is available for redutzu-mdt (current version: v%s | latest version: v%s)^0", 
                  currentVersion, response))
        else
            print(string.format("^9[Redutzu-MDT] You are using the latest version! (v%s)^0", response))
        end
    end, "GET")

    -- Configuration Validation
    if Upload.Method == "discord" and type(Config.Webhooks.images) ~= "string" then
        print("^9[Redutzu-MDT] You need to set the image api webhook in the config!^0")
    end

    -- Database Driver Check
    local oxmysqlState = GetResourceState("oxmysql")
    local mysqlAsyncState = GetResourceState("mysql-async")

    if oxmysqlState == "started" then
        print("^9[Redutzu-MDT] Your database driver is set to oxmysql!^0")
    elseif mysqlAsyncState == "started" then
        print("^9[Redutzu-MDT] Your database driver is set to mysql-async!^0")
    else
        print("^1[Redutzu-MDT] You need to install either oxmysql or mysql-async!^0")
    end
end)