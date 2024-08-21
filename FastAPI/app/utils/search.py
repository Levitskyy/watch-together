import re


def create_search_queries(input_string: str | None) -> list[str] | None:
    if not input_string:
        return None
    # Создаем список новых вариантов запроса
    search_variants = [input_string]
    # Заменяем пробелы на тире
    variant1 = input_string.replace(' ', '-')
    search_variants.append(variant1)
    # Заменяем тире на пробелы
    variant2 = input_string.replace('-', ' ')
    search_variants.append(variant2)
    # Возвращаем список новых вариантов запроса
    return search_variants
