def get_month(month_number):
    months = {
        1: "JANUARY",
        2: "FEBRUARY",
        3: "MARCH",
        4: "APRIL",
        5: "MAY",
        6: "JUNE",
        7: "JULY",
        8: "AUGUST",
        9: "SEPTEMBER",
        10: "OCTOBER",
        11: "NOVEMBER",
        12: "DECEMBER"
    }
    return months[month_number]


def get_day_enum(day):
    days = {
        "Sat": "SAT", "Sun": "SUN", "Mon": "MON", "Tue": "TUE", "Wed": "WED", "Thu": "THU", "Fri": "FRI"
    }
    return days[day]
