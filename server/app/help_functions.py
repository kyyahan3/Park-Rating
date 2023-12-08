def format_opening_hours(hours_dict):
    day_abbr = {
        "monday": "Mon", "tuesday": "Tue", "wednesday": "Wed",
        "thursday": "Thu", "friday": "Fri", "saturday": "Sat", "sunday": "Sun"
    }

    formatted_hours = []
    prev_hours = None
    days_group = []

    days_order = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    for day in days_order:
        if day in hours_dict:
            if hours_dict[day] == prev_hours:
                days_group.append(day_abbr[day])
            else:
                if days_group:
                    formatted_hours.append(format_group(days_group, prev_hours))
                days_group = [day_abbr[day]]
                prev_hours = hours_dict[day]

    if days_group:
        formatted_hours.append(format_group(days_group, prev_hours))

    return ';  '.join(formatted_hours)

def format_group(days, hours):
    if len(days) > 1:
        return f"{days[0]} to {days[-1]}: {hours}"
    return f"{days[0]}: {hours}"