-- Camera state variables
local isCameraActive = false
local isTakingPhoto = false
local cameraProp = nil

-- Camera configuration
local cameraZoom = (Config.CameraMinZoom + Config.CameraMaxZoom) * 0.5

-- Hide HUD elements during camera mode
function HideHUD()
    HideHelpTextThisFrame()
    HideHudAndRadarThisFrame()
    
    local hudComponents = {1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 15, 18, 19}
    for _, component in ipairs(hudComponents) do
        HideHudComponentThisFrame(component)
    end
end

-- Handle camera rotation input
function CheckInputRotation(camera, zoomFactor)
    local lookX = GetDisabledControlNormal(0, 220) -- Mouse X
    local lookY = GetDisabledControlNormal(0, 221) -- Mouse Y
    
    if lookX ~= 0.0 or lookY ~= 0.0 then
        local playerPed = PlayerPedId()
        local camRot = GetCamRot(camera, 2)
        
        -- Calculate new rotation
        local newZ = camRot.z + (lookX * -1.0 * Config.CameraRotationSpeed * (zoomFactor + 0.1))
        local newX = math.min(20.0, camRot.x + (lookY * -1.0 * Config.CameraRotationSpeed * (zoomFactor + 0.1)))
        newX = math.max(newX, -89.5)
        
        -- Apply rotation
        SetCamRot(camera, newX, 0.0, newZ, 2)
        SetEntityHeading(playerPed, newZ)
    end
end

-- Handle camera zoom input
function ZoomCamera(camera)
    local playerPed = PlayerPedId()
    local currentFov = GetCamFov(camera)
    
    if not IsPedSittingInAnyVehicle(playerPed) then
        -- On foot controls
        if IsControlJustPressed(0, 242) then -- Scroll down
            cameraZoom = math.max(cameraZoom - Config.CameraZoomSpeed, Config.CameraMinZoom)
        elseif IsControlJustPressed(0, 241) then -- Scroll up
            cameraZoom = math.min(cameraZoom + Config.CameraZoomSpeed, Config.CameraMaxZoom)
        end
    else
        -- In vehicle controls
        if IsControlJustPressed(0, 16) then -- Vehicle scroll down
            cameraZoom = math.max(cameraZoom - Config.CameraZoomSpeed, Config.CameraMinZoom)
        elseif IsControlJustPressed(0, 17) then -- Vehicle scroll up
            cameraZoom = math.min(cameraZoom + Config.CameraZoomSpeed, Config.CameraMaxZoom)
        end
    end
    
    -- Smooth FOV transition
    if math.abs(cameraZoom - currentFov) < 0.1 then
        cameraZoom = currentFov
    end
    
    local newFov = currentFov + (cameraZoom - currentFov) * 0.05
    SetCamFov(camera, newFov)
end

-- Exit camera mode
function ExitCameraMode()
    local playerPed = PlayerPedId()
    isCameraActive = false
    isTakingPhoto = false
    
    -- Play exit animation
    RequestAnim(Config.CameraExitAnimation, function(animDict)
        TaskPlayAnim(playerPed, animDict, "exit", 2.0, 2.0, -1, 1, 0, false, false, false)
    end)
    
    Wait(1000)
    
    -- Clean up
    if BusyspinnerIsDisplaying() then
        BusyspinnerOff()
    end
    
    ClearPedTasks(playerPed)
    
    if cameraProp then
        DeleteEntity(cameraProp)
        ClearPedTasks(playerPed)
    end
end

-- Take screenshot and upload
function TakeScreenshot(callback)
    local uploadConfig = Upload.Methods[Upload.Method]
    
    if not uploadConfig then
        print("[Screenshot] There is an error in your config/upload.lua file")
        return
    end
    
    exports["screenshot-basic"]:requestScreenshotUpload(
        uploadConfig.link,
        uploadConfig.field,
        uploadConfig.options,
        function(result)
            local decoded = json.decode(result)
            if not decoded then
                print("[Screenshot] There was an error while taking the picture")
                return
            end
            
            local imageUrl = getValueAtPath(decoded, uploadConfig.path)
            callback(imageUrl)
        end
    )
end

-- Main photo taking function
function TakePhoto(callback)
    if not isCameraActive then
        isCameraActive = true
        local playerPed = PlayerPedId()
        local playerCoords = GetEntityCoords(playerPed)
        local playerHeading = GetEntityHeading(playerPed)
        
        -- Play camera animation
        RequestAnim(Config.CameraBaseAnimation, function(animDict)
            TaskPlayAnim(playerPed, animDict, "base", 2.0, 2.0, -1, 1, 0, false, false, false)
        end)
        
        -- Create camera prop
        if not HasModelLoaded(Config.CameraProp) then
            LoadPropDict(Config.CameraProp)
        end
        
        local propHash = GetHashKey(Config.CameraProp)
        local boneIndex = GetPedBoneIndex(playerPed, 28422) -- Right hand bone
        
        cameraProp = CreateObject(propHash, playerCoords.x, playerCoords.y, playerCoords.z + 0.2, true, true, true)
        AttachEntityToEntity(cameraProp, playerPed, boneIndex, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, true, 1, true)
        
        -- Create camera
        local camera = CreateCam("DEFAULT_SCRIPTED_FLY_CAMERA", true)
        
        -- Set up camera effects
        SetTimecycleModifier("default")
        SetTimecycleModifierStrength(0.3)
        
        -- Position camera
        AttachCamToEntity(camera, playerPed, 0.0, 0.7, 0.7, true)
        SetCamRot(camera, 0.0, 0.0, playerHeading)
        SetCamFov(camera, cameraZoom)
        RenderScriptCams(true, false, 0, 1, 0)
        
        SetNuiFocus(false, false)
        
        -- Camera control thread
        CreateThread(function()
            while isCameraActive do
                -- Take photo on ENTER key
                if IsControlJustPressed(1, 176) and not isTakingPhoto then
                    isTakingPhoto = true
                    
                    BeginTextCommandBusyspinnerOn("STRING")
                    AddTextComponentSubstringPlayerName("Taking picture..")
                    EndTextCommandBusyspinnerOn(4)
                    
                    TakeScreenshot(function(imageUrl)
                        callback(imageUrl)
                        ExitCameraMode()
                        
                        -- Reset camera state
                        ClearTimecycleModifier()
                        cameraZoom = (Config.CameraMaxZoom + Config.CameraMinZoom) * 0.5
                        RenderScriptCams(false, false, 0, 1, 0)
                        DestroyCam(camera, false)
                    end)
                end
                
                -- Camera controls (only when not taking photo)
                if not isTakingPhoto then
                    local zoomRange = Config.CameraMaxZoom - Config.CameraMinZoom
                    local zoomFactor = 1.0 / zoomRange * (cameraZoom - Config.CameraMinZoom)
                    
                    CheckInputRotation(camera, zoomFactor)
                    ZoomCamera(camera)
                    HideHUD()
                end
                
                Wait(0)
            end
        end)
    else
        ExitCameraMode()
    end
end

-- NUI Callbacks
RegisterNUICallback("SetOpacity", function(data, cb)
    SendNUIMessage({
        action = "setOpacity",
        data = data
    })
    
    ToggleAnimation(data > 0)
    cb("ok")
end)

RegisterNUICallback("TakeScreenshot", function(data, cb)
    TakePhoto(function(imageUrl)
        SetNuiFocus(true, true)
        cb(imageUrl)
    end)
end)