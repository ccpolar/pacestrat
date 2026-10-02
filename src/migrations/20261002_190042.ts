import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_hero_wordmark_style" AS ENUM('logo', 'text');
  CREATE TYPE "public"."enum_hero_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__hero_v_version_wordmark_style" AS ENUM('logo', 'text');
  CREATE TYPE "public"."enum__hero_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pricing_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pricing_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_proof_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__proof_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_work_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__work_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_story_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__story_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_process_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__process_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_why_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__why_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faq_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_cta_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cta_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_brand_brand_timezone" AS ENUM('Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmera', 'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre', 'Africa/Brazzaville', 'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala', 'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 'Africa/Juba', 'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos', 'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey', 'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua', 'America/Araguaina', 'America/Argentina/La_Rioja', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia', 'America/Aruba', 'America/Asuncion', 'America/Bahia', 'America/Bahia_Banderas', 'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota', 'America/Boise', 'America/Buenos_Aires', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun', 'America/Caracas', 'America/Catamarca', 'America/Cayenne', 'America/Cayman', 'America/Chicago', 'America/Chihuahua', 'America/Ciudad_Juarez', 'America/Coral_Harbour', 'America/Cordoba', 'America/Costa_Rica', 'America/Coyhaique', 'America/Creston', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Dominica', 'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Fort_Nelson', 'America/Fortaleza', 'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil', 'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo', 'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Tell_City', 'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indianapolis', 'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Jujuy', 'America/Juneau', 'America/Kentucky/Monticello', 'America/Kralendijk', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Louisville', 'America/Lower_Princes', 'America/Maceio', 'America/Managua', 'America/Manaus', 'America/Marigot', 'America/Martinique', 'America/Matamoros', 'America/Mazatlan', 'America/Mendoza', 'America/Menominee', 'America/Merida', 'America/Metlakatla', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Monterrey', 'America/Montevideo', 'America/Montserrat', 'America/Nassau', 'America/New_York', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 'America/Port_of_Spain', 'America/Porto_Velho', 'America/Puerto_Rico', 'America/Punta_Arenas', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute', 'America/Rio_Branco', 'America/Santarem', 'America/Santiago', 'America/Santo_Domingo', 'America/Sao_Paulo', 'America/Scoresbysund', 'America/Sitka', 'America/St_Barthelemy', 'America/St_Johns', 'America/St_Kitts', 'America/St_Lucia', 'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current', 'America/Tegucigalpa', 'America/Thule', 'America/Tijuana', 'America/Toronto', 'America/Tortola', 'America/Vancouver', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Macquarie', 'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok', 'Arctic/Longyearbyen', 'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat', 'Asia/Atyrau', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Barnaul', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 'Asia/Calcutta', 'Asia/Chita', 'Asia/Colombo', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Famagusta', 'Asia/Gaza', 'Asia/Hebron', 'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Katmandu', 'Asia/Khandyga', 'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Kuwait', 'Asia/Macau', 'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novokuznetsk', 'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang', 'Asia/Qatar', 'Asia/Qostanay', 'Asia/Qyzylorda', 'Asia/Rangoon', 'Asia/Riyadh', 'Asia/Saigon', 'Asia/Sakhalin', 'Asia/Samarkand', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Srednekolymsk', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Tomsk', 'Asia/Ulaanbaatar', 'Asia/Urumqi', 'Asia/Ust-Nera', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yekaterinburg', 'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faeroe', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena', 'Atlantic/Stanley', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Darwin', 'Australia/Eucla', 'Australia/Hobart', 'Australia/Lindeman', 'Australia/Lord_Howe', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney', 'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Astrakhan', 'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Busingen', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man', 'Europe/Istanbul', 'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Kirov', 'Europe/Lisbon', 'Europe/Ljubljana', 'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Mariehamn', 'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Saratov', 'Europe/Simferopol', 'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane', 'Europe/Ulyanovsk', 'Europe/Vaduz', 'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Volgograd', 'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zurich', 'Indian/Antananarivo', 'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro', 'Indian/Kerguelen', 'Indian/Mahe', 'Indian/Maldives', 'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion', 'Pacific/Apia', 'Pacific/Auckland', 'Pacific/Bougainville', 'Pacific/Chatham', 'Pacific/Easter', 'Pacific/Efate', 'Pacific/Enderbury', 'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro', 'Pacific/Marquesas', 'Pacific/Midway', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk', 'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Ponape', 'Pacific/Port_Moresby', 'Pacific/Rarotonga', 'Pacific/Saipan', 'Pacific/Tahiti', 'Pacific/Tarawa', 'Pacific/Tongatapu', 'Pacific/Truk', 'Pacific/Wake', 'Pacific/Wallis');
  CREATE TYPE "public"."enum_brand_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__brand_v_version_brand_timezone" AS ENUM('Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmera', 'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre', 'Africa/Brazzaville', 'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala', 'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 'Africa/Juba', 'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos', 'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey', 'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua', 'America/Araguaina', 'America/Argentina/La_Rioja', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia', 'America/Aruba', 'America/Asuncion', 'America/Bahia', 'America/Bahia_Banderas', 'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota', 'America/Boise', 'America/Buenos_Aires', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun', 'America/Caracas', 'America/Catamarca', 'America/Cayenne', 'America/Cayman', 'America/Chicago', 'America/Chihuahua', 'America/Ciudad_Juarez', 'America/Coral_Harbour', 'America/Cordoba', 'America/Costa_Rica', 'America/Coyhaique', 'America/Creston', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Dominica', 'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Fort_Nelson', 'America/Fortaleza', 'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil', 'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo', 'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Tell_City', 'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indianapolis', 'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Jujuy', 'America/Juneau', 'America/Kentucky/Monticello', 'America/Kralendijk', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Louisville', 'America/Lower_Princes', 'America/Maceio', 'America/Managua', 'America/Manaus', 'America/Marigot', 'America/Martinique', 'America/Matamoros', 'America/Mazatlan', 'America/Mendoza', 'America/Menominee', 'America/Merida', 'America/Metlakatla', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Monterrey', 'America/Montevideo', 'America/Montserrat', 'America/Nassau', 'America/New_York', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 'America/Port_of_Spain', 'America/Porto_Velho', 'America/Puerto_Rico', 'America/Punta_Arenas', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute', 'America/Rio_Branco', 'America/Santarem', 'America/Santiago', 'America/Santo_Domingo', 'America/Sao_Paulo', 'America/Scoresbysund', 'America/Sitka', 'America/St_Barthelemy', 'America/St_Johns', 'America/St_Kitts', 'America/St_Lucia', 'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current', 'America/Tegucigalpa', 'America/Thule', 'America/Tijuana', 'America/Toronto', 'America/Tortola', 'America/Vancouver', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Macquarie', 'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok', 'Arctic/Longyearbyen', 'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat', 'Asia/Atyrau', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Barnaul', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 'Asia/Calcutta', 'Asia/Chita', 'Asia/Colombo', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Famagusta', 'Asia/Gaza', 'Asia/Hebron', 'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Katmandu', 'Asia/Khandyga', 'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Kuwait', 'Asia/Macau', 'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novokuznetsk', 'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang', 'Asia/Qatar', 'Asia/Qostanay', 'Asia/Qyzylorda', 'Asia/Rangoon', 'Asia/Riyadh', 'Asia/Saigon', 'Asia/Sakhalin', 'Asia/Samarkand', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Srednekolymsk', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Tomsk', 'Asia/Ulaanbaatar', 'Asia/Urumqi', 'Asia/Ust-Nera', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yekaterinburg', 'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faeroe', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena', 'Atlantic/Stanley', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Darwin', 'Australia/Eucla', 'Australia/Hobart', 'Australia/Lindeman', 'Australia/Lord_Howe', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney', 'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Astrakhan', 'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Busingen', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man', 'Europe/Istanbul', 'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Kirov', 'Europe/Lisbon', 'Europe/Ljubljana', 'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Mariehamn', 'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Saratov', 'Europe/Simferopol', 'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane', 'Europe/Ulyanovsk', 'Europe/Vaduz', 'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Volgograd', 'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zurich', 'Indian/Antananarivo', 'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro', 'Indian/Kerguelen', 'Indian/Mahe', 'Indian/Maldives', 'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion', 'Pacific/Apia', 'Pacific/Auckland', 'Pacific/Bougainville', 'Pacific/Chatham', 'Pacific/Easter', 'Pacific/Efate', 'Pacific/Enderbury', 'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro', 'Pacific/Marquesas', 'Pacific/Midway', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk', 'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Ponape', 'Pacific/Port_Moresby', 'Pacific/Rarotonga', 'Pacific/Saipan', 'Pacific/Tahiti', 'Pacific/Tarawa', 'Pacific/Tongatapu', 'Pacific/Truk', 'Pacific/Wake', 'Pacific/Wallis');
  CREATE TYPE "public"."enum__brand_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_theme_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__theme_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_layout_sections_section" AS ENUM('hero', 'pricing', 'proof', 'work', 'services', 'story', 'process', 'why', 'faq', 'cta', 'footer');
  CREATE TYPE "public"."enum_layout_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__layout_v_version_sections_section" AS ENUM('hero', 'pricing', 'proof', 'work', 'services', 'story', 'process', 'why', 'faq', 'cta', 'footer');
  CREATE TYPE "public"."enum__layout_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"category" varchar,
  	"year" varchar,
  	"image_media_id" integer,
  	"image_placeholder" varchar,
  	"href" varchar DEFAULT '#work',
  	"show_on_site" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_category" varchar,
  	"version_year" varchar,
  	"version_image_media_id" integer,
  	"version_image_placeholder" varchar,
  	"version_href" varchar DEFAULT '#work',
  	"version_show_on_site" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar DEFAULT 'Admin account',
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_placeholder" varchar,
  	"wordmark_style" "enum_hero_wordmark_style" DEFAULT 'text',
  	"headline1" varchar,
  	"headline2" varchar,
  	"descriptor" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"rating_show" boolean DEFAULT true,
  	"rating_score" numeric,
  	"rating_source" varchar,
  	"rating_label" varchar,
  	"copyright" varchar,
  	"_status" "enum_hero_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_hero_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_image_media_id" integer,
  	"version_image_placeholder" varchar,
  	"version_wordmark_style" "enum__hero_v_version_wordmark_style" DEFAULT 'text',
  	"version_headline1" varchar,
  	"version_headline2" varchar,
  	"version_descriptor" varchar,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_rating_show" boolean DEFAULT true,
  	"version_rating_score" numeric,
  	"version_rating_source" varchar,
  	"version_rating_label" varchar,
  	"version_copyright" varchar,
  	"version__status" "enum__hero_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pricing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Pricing',
  	"heading" varchar DEFAULT 'Performance-based pricing',
  	"statement" varchar,
  	"statement_muted" varchar,
  	"note_title" varchar,
  	"note_body" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"_status" "enum_pricing_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_pricing_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'Pricing',
  	"version_heading" varchar DEFAULT 'Performance-based pricing',
  	"version_statement" varchar,
  	"version_statement_muted" varchar,
  	"version_note_title" varchar,
  	"version_note_body" varchar,
  	"version_button_label" varchar,
  	"version_button_href" varchar,
  	"version__status" "enum__pricing_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "proof_stat_more" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "proof" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Proof',
  	"stat_label" varchar,
  	"stat_prefix" varchar,
  	"stat_value" numeric,
  	"stat_suffix" varchar,
  	"stat_caption" varchar,
  	"testimonial_quote" varchar,
  	"testimonial_name" varchar,
  	"testimonial_company" varchar,
  	"logos_label" varchar DEFAULT 'Trusted by',
  	"_status" "enum_proof_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_proof_v_version_stat_more" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_proof_v_version_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_proof_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'Proof',
  	"version_stat_label" varchar,
  	"version_stat_prefix" varchar,
  	"version_stat_value" numeric,
  	"version_stat_suffix" varchar,
  	"version_stat_caption" varchar,
  	"version_testimonial_quote" varchar,
  	"version_testimonial_name" varchar,
  	"version_testimonial_company" varchar,
  	"version_logos_label" varchar DEFAULT 'Trusted by',
  	"version__status" "enum__proof_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "work" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Selected work',
  	"heading" varchar DEFAULT 'Recent projects',
  	"intro" varchar,
  	"_status" "enum_work_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_work_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'Selected work',
  	"version_heading" varchar DEFAULT 'Recent projects',
  	"version_intro" varchar,
  	"version__status" "enum__work_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"tags" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Services',
  	"heading" varchar DEFAULT 'What we do',
  	"_status" "enum_services_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_services_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"tags" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'Services',
  	"version_heading" varchar DEFAULT 'What we do',
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "story" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Our story',
  	"founder_name" varchar,
  	"founder_title" varchar,
  	"founder_avatar_media_id" integer,
  	"founder_avatar_placeholder" varchar,
  	"statement" varchar,
  	"statement_muted" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"_status" "enum_story_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_story_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'Our story',
  	"version_founder_name" varchar,
  	"version_founder_title" varchar,
  	"version_founder_avatar_media_id" integer,
  	"version_founder_avatar_placeholder" varchar,
  	"version_statement" varchar,
  	"version_statement_muted" varchar,
  	"version_button_label" varchar,
  	"version_button_href" varchar,
  	"version__status" "enum__story_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "process" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Process',
  	"heading" varchar DEFAULT 'How we work',
  	"_status" "enum_process_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_process_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_process_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'Process',
  	"version_heading" varchar DEFAULT 'How we work',
  	"version__status" "enum__process_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "why_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "why" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Why us',
  	"heading" varchar DEFAULT 'Built different, on purpose',
  	"_status" "enum_why_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_why_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_why_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'Why us',
  	"version_heading" varchar DEFAULT 'Built different, on purpose',
  	"version__status" "enum__why_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'FAQ',
  	"heading" varchar DEFAULT 'Questions, answered',
  	"_status" "enum_faq_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_faq_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faq_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'FAQ',
  	"version_heading" varchar DEFAULT 'Questions, answered',
  	"version__status" "enum__faq_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "cta" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Contact',
  	"headline" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"_status" "enum_cta_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_cta_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar DEFAULT 'Contact',
  	"version_headline" varchar,
  	"version_body" varchar,
  	"version_button_label" varchar,
  	"version_button_href" varchar,
  	"version__status" "enum__cta_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legal" varchar,
  	"_status" "enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_footer_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_legal" varchar,
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "brand" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar,
  	"brand_suffix" varchar,
  	"brand_mark" varchar DEFAULT '®',
  	"brand_logo_id" integer,
  	"brand_logo_mark_id" integer,
  	"brand_tagline" varchar,
  	"brand_email" varchar,
  	"brand_location" varchar,
  	"brand_timezone" "enum_brand_brand_timezone",
  	"brand_availability_active" boolean DEFAULT true,
  	"brand_availability_label" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_lang" varchar DEFAULT 'en',
  	"_status" "enum_brand_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_brand_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_brand_name" varchar,
  	"version_brand_suffix" varchar,
  	"version_brand_mark" varchar DEFAULT '®',
  	"version_brand_logo_id" integer,
  	"version_brand_logo_mark_id" integer,
  	"version_brand_tagline" varchar,
  	"version_brand_email" varchar,
  	"version_brand_location" varchar,
  	"version_brand_timezone" "enum__brand_v_version_brand_timezone",
  	"version_brand_availability_active" boolean DEFAULT true,
  	"version_brand_availability_label" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_lang" varchar DEFAULT 'en',
  	"version__status" "enum__brand_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"accent" varchar,
  	"dark" varchar,
  	"light" varchar,
  	"card" varchar,
  	"grey" varchar,
  	"font_display" varchar,
  	"font_body" varchar,
  	"radius" numeric,
  	"_status" "enum_theme_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_theme_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_accent" varchar,
  	"version_dark" varchar,
  	"version_light" varchar,
  	"version_card" varchar,
  	"version_grey" varchar,
  	"version_font_display" varchar,
  	"version_font_body" varchar,
  	"version_radius" numeric,
  	"version__status" "enum__theme_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "layout_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section" "enum_layout_sections_section",
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "layout_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "layout" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ui_menu_title" varchar DEFAULT 'Menu',
  	"ui_menu_open" varchar DEFAULT 'Open menu',
  	"ui_menu_close" varchar DEFAULT 'Close menu',
  	"ui_footer_links_title" varchar DEFAULT 'Sitemap',
  	"ui_footer_socials_title" varchar DEFAULT 'Follow',
  	"ui_footer_contact_title" varchar DEFAULT 'Say hello',
  	"ui_counter" varchar DEFAULT '(+ {n})',
  	"ui_motif" varchar DEFAULT '/////',
  	"ui_back_to_top" varchar DEFAULT 'Back to top',
  	"ui_skip_to_content" varchar DEFAULT 'Skip to content',
  	"ui_local_time" varchar DEFAULT 'Local time in',
  	"ui_view_project" varchar DEFAULT 'View project',
  	"ui_rating_out_of" varchar DEFAULT '{score} out of 5 stars',
  	"_status" "enum_layout_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_layout_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section" "enum__layout_v_version_sections_section",
  	"visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_layout_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_layout_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_ui_menu_title" varchar DEFAULT 'Menu',
  	"version_ui_menu_open" varchar DEFAULT 'Open menu',
  	"version_ui_menu_close" varchar DEFAULT 'Close menu',
  	"version_ui_footer_links_title" varchar DEFAULT 'Sitemap',
  	"version_ui_footer_socials_title" varchar DEFAULT 'Follow',
  	"version_ui_footer_contact_title" varchar DEFAULT 'Say hello',
  	"version_ui_counter" varchar DEFAULT '(+ {n})',
  	"version_ui_motif" varchar DEFAULT '/////',
  	"version_ui_back_to_top" varchar DEFAULT 'Back to top',
  	"version_ui_skip_to_content" varchar DEFAULT 'Skip to content',
  	"version_ui_local_time" varchar DEFAULT 'Local time in',
  	"version_ui_view_project" varchar DEFAULT 'View project',
  	"version_ui_rating_out_of" varchar DEFAULT '{score} out of 5 stars',
  	"version__status" "enum__layout_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_image_media_id_media_id_fk" FOREIGN KEY ("version_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_v" ADD CONSTRAINT "_hero_v_version_image_media_id_media_id_fk" FOREIGN KEY ("version_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proof_stat_more" ADD CONSTRAINT "proof_stat_more_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proof_logos" ADD CONSTRAINT "proof_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proof_logos" ADD CONSTRAINT "proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proof_v_version_stat_more" ADD CONSTRAINT "_proof_v_version_stat_more_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proof_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proof_v_version_logos" ADD CONSTRAINT "_proof_v_version_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proof_v_version_logos" ADD CONSTRAINT "_proof_v_version_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proof_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_items" ADD CONSTRAINT "services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_items" ADD CONSTRAINT "_services_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story" ADD CONSTRAINT "story_founder_avatar_media_id_media_id_fk" FOREIGN KEY ("founder_avatar_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_story_v" ADD CONSTRAINT "_story_v_version_founder_avatar_media_id_media_id_fk" FOREIGN KEY ("version_founder_avatar_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "process_steps" ADD CONSTRAINT "process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_process_v_version_steps" ADD CONSTRAINT "_process_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_process_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "why_items" ADD CONSTRAINT "why_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_why_v_version_items" ADD CONSTRAINT "_why_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_why_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_v_version_items" ADD CONSTRAINT "_faq_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faq_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links" ADD CONSTRAINT "footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_socials" ADD CONSTRAINT "footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_links" ADD CONSTRAINT "_footer_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_socials" ADD CONSTRAINT "_footer_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brand" ADD CONSTRAINT "brand_brand_logo_id_media_id_fk" FOREIGN KEY ("brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brand" ADD CONSTRAINT "brand_brand_logo_mark_id_media_id_fk" FOREIGN KEY ("brand_logo_mark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brand" ADD CONSTRAINT "brand_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brand_v" ADD CONSTRAINT "_brand_v_version_brand_logo_id_media_id_fk" FOREIGN KEY ("version_brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brand_v" ADD CONSTRAINT "_brand_v_version_brand_logo_mark_id_media_id_fk" FOREIGN KEY ("version_brand_logo_mark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brand_v" ADD CONSTRAINT "_brand_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layout_sections" ADD CONSTRAINT "layout_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "layout_links" ADD CONSTRAINT "layout_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_layout_v_version_sections" ADD CONSTRAINT "_layout_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_layout_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_layout_v_version_links" ADD CONSTRAINT "_layout_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_layout_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE INDEX "projects_image_image_media_idx" ON "projects" USING btree ("image_media_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version__order_idx" ON "_projects_v" USING btree ("version__order");
  CREATE INDEX "_projects_v_version_image_version_image_media_idx" ON "_projects_v" USING btree ("version_image_media_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "hero_image_image_media_idx" ON "hero" USING btree ("image_media_id");
  CREATE INDEX "hero__status_idx" ON "hero" USING btree ("_status");
  CREATE INDEX "_hero_v_version_image_version_image_media_idx" ON "_hero_v" USING btree ("version_image_media_id");
  CREATE INDEX "_hero_v_version_version__status_idx" ON "_hero_v" USING btree ("version__status");
  CREATE INDEX "_hero_v_created_at_idx" ON "_hero_v" USING btree ("created_at");
  CREATE INDEX "_hero_v_updated_at_idx" ON "_hero_v" USING btree ("updated_at");
  CREATE INDEX "_hero_v_latest_idx" ON "_hero_v" USING btree ("latest");
  CREATE INDEX "pricing__status_idx" ON "pricing" USING btree ("_status");
  CREATE INDEX "_pricing_v_version_version__status_idx" ON "_pricing_v" USING btree ("version__status");
  CREATE INDEX "_pricing_v_created_at_idx" ON "_pricing_v" USING btree ("created_at");
  CREATE INDEX "_pricing_v_updated_at_idx" ON "_pricing_v" USING btree ("updated_at");
  CREATE INDEX "_pricing_v_latest_idx" ON "_pricing_v" USING btree ("latest");
  CREATE INDEX "proof_stat_more_order_idx" ON "proof_stat_more" USING btree ("_order");
  CREATE INDEX "proof_stat_more_parent_id_idx" ON "proof_stat_more" USING btree ("_parent_id");
  CREATE INDEX "proof_logos_order_idx" ON "proof_logos" USING btree ("_order");
  CREATE INDEX "proof_logos_parent_id_idx" ON "proof_logos" USING btree ("_parent_id");
  CREATE INDEX "proof_logos_logo_idx" ON "proof_logos" USING btree ("logo_id");
  CREATE INDEX "proof__status_idx" ON "proof" USING btree ("_status");
  CREATE INDEX "_proof_v_version_stat_more_order_idx" ON "_proof_v_version_stat_more" USING btree ("_order");
  CREATE INDEX "_proof_v_version_stat_more_parent_id_idx" ON "_proof_v_version_stat_more" USING btree ("_parent_id");
  CREATE INDEX "_proof_v_version_logos_order_idx" ON "_proof_v_version_logos" USING btree ("_order");
  CREATE INDEX "_proof_v_version_logos_parent_id_idx" ON "_proof_v_version_logos" USING btree ("_parent_id");
  CREATE INDEX "_proof_v_version_logos_logo_idx" ON "_proof_v_version_logos" USING btree ("logo_id");
  CREATE INDEX "_proof_v_version_version__status_idx" ON "_proof_v" USING btree ("version__status");
  CREATE INDEX "_proof_v_created_at_idx" ON "_proof_v" USING btree ("created_at");
  CREATE INDEX "_proof_v_updated_at_idx" ON "_proof_v" USING btree ("updated_at");
  CREATE INDEX "_proof_v_latest_idx" ON "_proof_v" USING btree ("latest");
  CREATE INDEX "work__status_idx" ON "work" USING btree ("_status");
  CREATE INDEX "_work_v_version_version__status_idx" ON "_work_v" USING btree ("version__status");
  CREATE INDEX "_work_v_created_at_idx" ON "_work_v" USING btree ("created_at");
  CREATE INDEX "_work_v_updated_at_idx" ON "_work_v" USING btree ("updated_at");
  CREATE INDEX "_work_v_latest_idx" ON "_work_v" USING btree ("latest");
  CREATE INDEX "services_items_order_idx" ON "services_items" USING btree ("_order");
  CREATE INDEX "services_items_parent_id_idx" ON "services_items" USING btree ("_parent_id");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_version_items_order_idx" ON "_services_v_version_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_items_parent_id_idx" ON "_services_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "story_founder_avatar_founder_avatar_media_idx" ON "story" USING btree ("founder_avatar_media_id");
  CREATE INDEX "story__status_idx" ON "story" USING btree ("_status");
  CREATE INDEX "_story_v_version_founder_avatar_version_founder_avatar_m_idx" ON "_story_v" USING btree ("version_founder_avatar_media_id");
  CREATE INDEX "_story_v_version_version__status_idx" ON "_story_v" USING btree ("version__status");
  CREATE INDEX "_story_v_created_at_idx" ON "_story_v" USING btree ("created_at");
  CREATE INDEX "_story_v_updated_at_idx" ON "_story_v" USING btree ("updated_at");
  CREATE INDEX "_story_v_latest_idx" ON "_story_v" USING btree ("latest");
  CREATE INDEX "process_steps_order_idx" ON "process_steps" USING btree ("_order");
  CREATE INDEX "process_steps_parent_id_idx" ON "process_steps" USING btree ("_parent_id");
  CREATE INDEX "process__status_idx" ON "process" USING btree ("_status");
  CREATE INDEX "_process_v_version_steps_order_idx" ON "_process_v_version_steps" USING btree ("_order");
  CREATE INDEX "_process_v_version_steps_parent_id_idx" ON "_process_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_process_v_version_version__status_idx" ON "_process_v" USING btree ("version__status");
  CREATE INDEX "_process_v_created_at_idx" ON "_process_v" USING btree ("created_at");
  CREATE INDEX "_process_v_updated_at_idx" ON "_process_v" USING btree ("updated_at");
  CREATE INDEX "_process_v_latest_idx" ON "_process_v" USING btree ("latest");
  CREATE INDEX "why_items_order_idx" ON "why_items" USING btree ("_order");
  CREATE INDEX "why_items_parent_id_idx" ON "why_items" USING btree ("_parent_id");
  CREATE INDEX "why__status_idx" ON "why" USING btree ("_status");
  CREATE INDEX "_why_v_version_items_order_idx" ON "_why_v_version_items" USING btree ("_order");
  CREATE INDEX "_why_v_version_items_parent_id_idx" ON "_why_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_why_v_version_version__status_idx" ON "_why_v" USING btree ("version__status");
  CREATE INDEX "_why_v_created_at_idx" ON "_why_v" USING btree ("created_at");
  CREATE INDEX "_why_v_updated_at_idx" ON "_why_v" USING btree ("updated_at");
  CREATE INDEX "_why_v_latest_idx" ON "_why_v" USING btree ("latest");
  CREATE INDEX "faq_items_order_idx" ON "faq_items" USING btree ("_order");
  CREATE INDEX "faq_items_parent_id_idx" ON "faq_items" USING btree ("_parent_id");
  CREATE INDEX "faq__status_idx" ON "faq" USING btree ("_status");
  CREATE INDEX "_faq_v_version_items_order_idx" ON "_faq_v_version_items" USING btree ("_order");
  CREATE INDEX "_faq_v_version_items_parent_id_idx" ON "_faq_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_faq_v_version_version__status_idx" ON "_faq_v" USING btree ("version__status");
  CREATE INDEX "_faq_v_created_at_idx" ON "_faq_v" USING btree ("created_at");
  CREATE INDEX "_faq_v_updated_at_idx" ON "_faq_v" USING btree ("updated_at");
  CREATE INDEX "_faq_v_latest_idx" ON "_faq_v" USING btree ("latest");
  CREATE INDEX "cta__status_idx" ON "cta" USING btree ("_status");
  CREATE INDEX "_cta_v_version_version__status_idx" ON "_cta_v" USING btree ("version__status");
  CREATE INDEX "_cta_v_created_at_idx" ON "_cta_v" USING btree ("created_at");
  CREATE INDEX "_cta_v_updated_at_idx" ON "_cta_v" USING btree ("updated_at");
  CREATE INDEX "_cta_v_latest_idx" ON "_cta_v" USING btree ("latest");
  CREATE INDEX "footer_links_order_idx" ON "footer_links" USING btree ("_order");
  CREATE INDEX "footer_links_parent_id_idx" ON "footer_links" USING btree ("_parent_id");
  CREATE INDEX "footer_socials_order_idx" ON "footer_socials" USING btree ("_order");
  CREATE INDEX "footer_socials_parent_id_idx" ON "footer_socials" USING btree ("_parent_id");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");
  CREATE INDEX "_footer_v_version_links_order_idx" ON "_footer_v_version_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_links_parent_id_idx" ON "_footer_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_socials_order_idx" ON "_footer_v_version_socials" USING btree ("_order");
  CREATE INDEX "_footer_v_version_socials_parent_id_idx" ON "_footer_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "brand_brand_brand_logo_idx" ON "brand" USING btree ("brand_logo_id");
  CREATE INDEX "brand_brand_brand_logo_mark_idx" ON "brand" USING btree ("brand_logo_mark_id");
  CREATE INDEX "brand_seo_seo_og_image_idx" ON "brand" USING btree ("seo_og_image_id");
  CREATE INDEX "brand__status_idx" ON "brand" USING btree ("_status");
  CREATE INDEX "_brand_v_version_brand_version_brand_logo_idx" ON "_brand_v" USING btree ("version_brand_logo_id");
  CREATE INDEX "_brand_v_version_brand_version_brand_logo_mark_idx" ON "_brand_v" USING btree ("version_brand_logo_mark_id");
  CREATE INDEX "_brand_v_version_seo_version_seo_og_image_idx" ON "_brand_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_brand_v_version_version__status_idx" ON "_brand_v" USING btree ("version__status");
  CREATE INDEX "_brand_v_created_at_idx" ON "_brand_v" USING btree ("created_at");
  CREATE INDEX "_brand_v_updated_at_idx" ON "_brand_v" USING btree ("updated_at");
  CREATE INDEX "_brand_v_latest_idx" ON "_brand_v" USING btree ("latest");
  CREATE INDEX "theme__status_idx" ON "theme" USING btree ("_status");
  CREATE INDEX "_theme_v_version_version__status_idx" ON "_theme_v" USING btree ("version__status");
  CREATE INDEX "_theme_v_created_at_idx" ON "_theme_v" USING btree ("created_at");
  CREATE INDEX "_theme_v_updated_at_idx" ON "_theme_v" USING btree ("updated_at");
  CREATE INDEX "_theme_v_latest_idx" ON "_theme_v" USING btree ("latest");
  CREATE INDEX "layout_sections_order_idx" ON "layout_sections" USING btree ("_order");
  CREATE INDEX "layout_sections_parent_id_idx" ON "layout_sections" USING btree ("_parent_id");
  CREATE INDEX "layout_links_order_idx" ON "layout_links" USING btree ("_order");
  CREATE INDEX "layout_links_parent_id_idx" ON "layout_links" USING btree ("_parent_id");
  CREATE INDEX "layout__status_idx" ON "layout" USING btree ("_status");
  CREATE INDEX "_layout_v_version_sections_order_idx" ON "_layout_v_version_sections" USING btree ("_order");
  CREATE INDEX "_layout_v_version_sections_parent_id_idx" ON "_layout_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_layout_v_version_links_order_idx" ON "_layout_v_version_links" USING btree ("_order");
  CREATE INDEX "_layout_v_version_links_parent_id_idx" ON "_layout_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_layout_v_version_version__status_idx" ON "_layout_v" USING btree ("version__status");
  CREATE INDEX "_layout_v_created_at_idx" ON "_layout_v" USING btree ("created_at");
  CREATE INDEX "_layout_v_updated_at_idx" ON "_layout_v" USING btree ("updated_at");
  CREATE INDEX "_layout_v_latest_idx" ON "_layout_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "hero" CASCADE;
  DROP TABLE "_hero_v" CASCADE;
  DROP TABLE "pricing" CASCADE;
  DROP TABLE "_pricing_v" CASCADE;
  DROP TABLE "proof_stat_more" CASCADE;
  DROP TABLE "proof_logos" CASCADE;
  DROP TABLE "proof" CASCADE;
  DROP TABLE "_proof_v_version_stat_more" CASCADE;
  DROP TABLE "_proof_v_version_logos" CASCADE;
  DROP TABLE "_proof_v" CASCADE;
  DROP TABLE "work" CASCADE;
  DROP TABLE "_work_v" CASCADE;
  DROP TABLE "services_items" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v_version_items" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "story" CASCADE;
  DROP TABLE "_story_v" CASCADE;
  DROP TABLE "process_steps" CASCADE;
  DROP TABLE "process" CASCADE;
  DROP TABLE "_process_v_version_steps" CASCADE;
  DROP TABLE "_process_v" CASCADE;
  DROP TABLE "why_items" CASCADE;
  DROP TABLE "why" CASCADE;
  DROP TABLE "_why_v_version_items" CASCADE;
  DROP TABLE "_why_v" CASCADE;
  DROP TABLE "faq_items" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "_faq_v_version_items" CASCADE;
  DROP TABLE "_faq_v" CASCADE;
  DROP TABLE "cta" CASCADE;
  DROP TABLE "_cta_v" CASCADE;
  DROP TABLE "footer_links" CASCADE;
  DROP TABLE "footer_socials" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "_footer_v_version_links" CASCADE;
  DROP TABLE "_footer_v_version_socials" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "brand" CASCADE;
  DROP TABLE "_brand_v" CASCADE;
  DROP TABLE "theme" CASCADE;
  DROP TABLE "_theme_v" CASCADE;
  DROP TABLE "layout_sections" CASCADE;
  DROP TABLE "layout_links" CASCADE;
  DROP TABLE "layout" CASCADE;
  DROP TABLE "_layout_v_version_sections" CASCADE;
  DROP TABLE "_layout_v_version_links" CASCADE;
  DROP TABLE "_layout_v" CASCADE;
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_hero_wordmark_style";
  DROP TYPE "public"."enum_hero_status";
  DROP TYPE "public"."enum__hero_v_version_wordmark_style";
  DROP TYPE "public"."enum__hero_v_version_status";
  DROP TYPE "public"."enum_pricing_status";
  DROP TYPE "public"."enum__pricing_v_version_status";
  DROP TYPE "public"."enum_proof_status";
  DROP TYPE "public"."enum__proof_v_version_status";
  DROP TYPE "public"."enum_work_status";
  DROP TYPE "public"."enum__work_v_version_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_story_status";
  DROP TYPE "public"."enum__story_v_version_status";
  DROP TYPE "public"."enum_process_status";
  DROP TYPE "public"."enum__process_v_version_status";
  DROP TYPE "public"."enum_why_status";
  DROP TYPE "public"."enum__why_v_version_status";
  DROP TYPE "public"."enum_faq_status";
  DROP TYPE "public"."enum__faq_v_version_status";
  DROP TYPE "public"."enum_cta_status";
  DROP TYPE "public"."enum__cta_v_version_status";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_version_status";
  DROP TYPE "public"."enum_brand_brand_timezone";
  DROP TYPE "public"."enum_brand_status";
  DROP TYPE "public"."enum__brand_v_version_brand_timezone";
  DROP TYPE "public"."enum__brand_v_version_status";
  DROP TYPE "public"."enum_theme_status";
  DROP TYPE "public"."enum__theme_v_version_status";
  DROP TYPE "public"."enum_layout_sections_section";
  DROP TYPE "public"."enum_layout_status";
  DROP TYPE "public"."enum__layout_v_version_sections_section";
  DROP TYPE "public"."enum__layout_v_version_status";`)
}
