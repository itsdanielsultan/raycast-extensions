-- Finder Services integration informed by astroboii47/blip-raycast (MIT).
on run filePaths
  if (count filePaths) is 0 then error "BLIP_EMPTY_SELECTION"
  set targetItems to {}
  set expectedPaths to {}
  set itemCount to count filePaths
  set pickerTitle to (itemCount as text) & " Items"
  set singleItemName to ""
  if itemCount is 1 then set pickerTitle to "1 Item"
  repeat with filePath in filePaths
    set targetItem to (POSIX file (filePath as text)) as alias
    set end of targetItems to targetItem
    set end of expectedPaths to POSIX path of targetItem
    if itemCount is 1 then tell application "Finder" to set singleItemName to name of targetItem
  end repeat
  -- A pre-existing matching picker must not satisfy the new handoff's postcondition.
  tell application "System Events"
    if exists process "Blip" then
      tell process "Blip"
        repeat with existingWindow in windows
          set existingTitle to name of existingWindow
          if existingTitle is pickerTitle or (itemCount is 1 and existingTitle is singleItemName) then error "BLIP_EXISTING_PICKER"
        end repeat
      end tell
    end if
  end tell
  tell application "Finder"
    activate
    reveal targetItems
    set selection to targetItems
    set currentItems to selection
    set currentPaths to {}
    repeat with selectedItem in currentItems
      set end of currentPaths to POSIX path of (selectedItem as alias)
    end repeat
  end tell
  if (count currentPaths) is not (count expectedPaths) then error "BLIP_PARTIAL_FINDER_SELECTION"
  repeat with expectedPath in expectedPaths
    if (expectedPath as text) is not in currentPaths then error "BLIP_PARTIAL_FINDER_SELECTION"
  end repeat
  tell application "System Events"
    set didInvokeService to false
    tell process "Finder"
      set frontmost to true
      set finderMenu to menu 1 of menu bar item "Finder" of menu bar 1
      repeat with appMenuItem in menu items of finderMenu
        if exists menu 1 of appMenuItem then
          repeat with serviceItem in menu items of menu 1 of appMenuItem
            set serviceName to name of serviceItem
            if serviceName is "Blip…" or serviceName is "Blip..." then
              if enabled of serviceItem is false then error "BLIP_SERVICE_DISABLED"
              click serviceItem
              set didInvokeService to true
              exit repeat
            end if
          end repeat
        end if
        if didInvokeService then exit repeat
      end repeat
    end tell
    if not didInvokeService then error "BLIP_SERVICE_NOT_FOUND"
    set readinessDeadline to (current date) + 15
    repeat while (current date) < readinessDeadline
      if exists process "Blip" then
        tell process "Blip"
          if exists window 1 then
            set pickerWindow to window 1
            set currentTitle to name of pickerWindow
            if currentTitle is pickerTitle or (itemCount is 1 and currentTitle is singleItemName) then
              repeat with uiElement in entire contents of pickerWindow
                try
                  if class of uiElement is text field and enabled of uiElement then return "prepared"
                end try
              end repeat
            end if
          end if
        end tell
      end if
      delay 0.1
    end repeat
  end tell
  error "BLIP_PICKER_NOT_READY"
end run
