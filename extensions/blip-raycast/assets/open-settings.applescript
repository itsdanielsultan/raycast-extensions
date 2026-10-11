on run arguments
  set paneName to item 1 of arguments
  if paneName is not in {"General", "Profile", "Devices", "Help"} then error "BLIP_UNKNOWN_SETTINGS_PANE"
  tell application id "net.blip.macos"
    activate
  end tell
  tell application "System Events"
    tell process "Blip"
      set frontmost to true
      if not (exists window "Blip Settings") then
        set settingsButton to missing value
        repeat 2 times
          repeat with uiElement in entire contents
            try
              if class of uiElement is button and description of uiElement is "Settings" then
                set settingsButton to uiElement
                exit repeat
              end if
            end try
          end repeat
          if settingsButton is not missing value then exit repeat
          delay 0.1
        end repeat
        if settingsButton is missing value then
          tell application id "net.blip.macos" to reopen
          repeat 15 times
            repeat with uiElement in entire contents
              try
                if class of uiElement is button and description of uiElement is "Settings" then
                  set settingsButton to uiElement
                  exit repeat
                end if
              end try
            end repeat
            if settingsButton is not missing value then exit repeat
            delay 0.1
          end repeat
        end if
        if settingsButton is missing value then error "BLIP_SETTINGS_BUTTON_NOT_FOUND"
        click settingsButton
        set didClickSettings to false
        repeat 15 times
          repeat with uiElement in entire contents
            try
              if class of uiElement is menu item and name of uiElement is "Settings…" and enabled of uiElement then
                click uiElement
                set didClickSettings to true
                exit repeat
              end if
            end try
          end repeat
          if didClickSettings then exit repeat
          delay 0.1
        end repeat
        if not didClickSettings then error "BLIP_SETTINGS_MENU_NOT_FOUND"
      end if
      repeat 20 times
        if exists window "Blip Settings" then
          tell window "Blip Settings"
            if exists button paneName of toolbar 1 then
              click button paneName of toolbar 1
              return paneName
            end if
          end tell
        end if
        delay 0.1
      end repeat
    end tell
  end tell
  error "BLIP_SETTINGS_WINDOW_NOT_FOUND"
end run
