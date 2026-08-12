RegisterCallback("GetCitizenData", function(source, cb, citizenData)
    local citizenProfile = {
        incidents = {},
        evidences = {},
        warrants = {},
        vehicles = {},
        bolos = {},
        properties = {}
    }

    -- Fetch all related citizen data from various tables
    for dataType, _ in pairs(citizenProfile) do
        local result = Database.fetchAll({
            table = Config.Tables[dataType],
            condition = Config.Queries["search:citizen:" .. dataType],
            parameters = { query = "%" .. citizenData.identifier .. "%" }
        })
        citizenProfile[dataType] = result
    end

    -- Get citizen properties/houses with error handling
    local success, properties = pcall(function()
        return GetCitizenHouses(citizenData.identifier)
    end)

    if not success then
        print("^1Please set the housing script in your config file!")
        citizenProfile.properties = {}
    else
        citizenProfile.properties = properties
    end

    -- Get basic citizen information
    local citizenInfo = Database.fetchSingle({
        table = Config.Tables.citizen,
        condition = Config.Queries["search:citizen"],
        parameters = { query = citizenData.identifier }
    })

    -- Check if citizen is wanted (has active warrants or bolos)
    local isWanted = false

    for _, warrant in ipairs(citizenProfile.warrants) do
        if not warrant.done then
            isWanted = true
            break
        end
    end

    if not isWanted then
        for _, bolo in ipairs(citizenProfile.bolos) do
            if bolo.status then
                isWanted = true
                break
            end
        end
    end

    -- Get licenses if license system is enabled
    local licenses = {}
    if Config.LicenseSystem ~= "none" then
        licenses = GetPlayerLicenses(citizenData.identifier)
    end

    -- Get citizen phone number
    local phoneNumber = GetCitizenPhoneNumber(citizenInfo)

    -- Get job information
    local citizenJob = Jobs[citizenInfo.job]
    local jobGrade = tostring(citizenInfo.job_grade)
    
    local jobInfo = {
        label = citizenJob and citizenJob.label or nil,
        grade = citizenJob and citizenJob.grades[jobGrade] and citizenJob.grades[jobGrade].label or nil
    }

    -- Compile final response
    local response = {
        list = {
            citizenProfile.incidents,
            citizenProfile.evidences,
            citizenProfile.warrants,
            citizenProfile.vehicles,
            citizenProfile.properties,
            citizenProfile.bolos
        },
        wanted = isWanted,
        licenses = licenses,
        phone_number = phoneNumber,
        job = jobInfo
    }

    cb(response)
end)

RegisterCallback("RemoveCitizenLicense", function(source, cb, licenseData)
    RemoveCitizenLicense(licenseData)
    cb("ok")
end)