def conversion_rates_in_gram(measurement, existing_measurement, item_qty, existing_qty):
    measurements = {
        "sprigs": 1, "cups": 48, "cup": 48, "cloves": 0.1, "teaspoon": 0.02, "teaspoons": 0.02,
        "tsp": 0.02, "tablespoon": 0.06, "tablespoons": 0.06, "tbsp": 0.06, "ribs": 0.2,
        "pound": 16, "pounds": 16, "piece": 1, "pieces": 1, "ounce": 0.16, "pinch": 0.01,
        "lb": 16, "clove": 0.1, "stick": 0.06, '': 1, "ounces": 0.16, "heads": 1, "head": 1
    }
    single_measurements = ["heads", "pieces", "head", "piece", '']

    if measurement in single_measurements and existing_measurement in single_measurements:
        converted_quantity = float(item_qty) * measurements[measurement] + \
                             float(existing_qty) * measurements[existing_measurement]
        selected_measurement = 'pieces'
    elif measurement in measurements and existing_measurement in measurements:
        converted_quantity = float(item_qty) * measurements[measurement] + \
                             float(existing_qty) * measurements[existing_measurement]
        selected_measurement = 'grams'
    else:
        converted_quantity = None
        selected_measurement = None
    return converted_quantity, selected_measurement
