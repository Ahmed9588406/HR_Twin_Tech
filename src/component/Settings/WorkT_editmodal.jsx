import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { updateShift, createShift, fetchBranches } from './api/settings_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

// Add TIMEZONES constant (IANA time zone identifiers)
const TIMEZONES = [
  'UTC',
  'Africa/Abidjan','Africa/Accra','Africa/Addis_Ababa','Africa/Algiers','Africa/Asmara','Africa/Bamako','Africa/Bangui',
  'Africa/Banjul','Africa/Bissau','Africa/Blantyre','Africa/Brazzaville','Africa/Bujumbura','Africa/Cairo','Africa/Casablanca',
  'Africa/Ceuta','Africa/Conakry','Africa/Dakar','Africa/Dar_es_Salaam','Africa/Djibouti','Africa/Douala','Africa/El_Aaiun',
  'Africa/Freetown','Africa/Gaborone','Africa/Harare','Africa/Johannesburg','Africa/Juba','Africa/Kampala','Africa/Khartoum',
  'Africa/Kigali','Africa/Kinshasa','Africa/Lagos','Africa/Libreville','Africa/Lome','Africa/Luanda','Africa/Lubumbashi',
  'Africa/Lusaka','Africa/Malabo','Africa/Maputo','Africa/Maseru','Africa/Mbabane','Africa/Mogadishu','Africa/Monrovia',
  'Africa/Nairobi','Africa/Ndjamena','Africa/Niamey','Africa/Nouakchott','Africa/Ouagadougou','Africa/Porto-Novo','Africa/Sao_Tome',
  'Africa/Tripoli','Africa/Tunis','Africa/Windhoek',
  'America/Adak','America/Anchorage','America/Anguilla','America/Antigua','America/Araguaina','America/Argentina/Buenos_Aires',
  'America/Argentina/Catamarca','America/Argentina/Cordoba','America/Argentina/Jujuy','America/Argentina/La_Rioja',
  'America/Argentina/Mendoza','America/Argentina/Rio_Gallegos','America/Argentina/Salta','America/Argentina/San_Juan',
  'America/Argentina/San_Luis','America/Argentina/Tucuman','America/Argentina/Ushuaia','America/Aruba','America/Asuncion',
  'America/Atikokan','America/Bahia','America/Bahia_Banderas','America/Barbados','America/Belem','America/Belize',
  'America/Blanc-Sablon','America/Boa_Vista','America/Bogota','America/Boise','America/Cambridge_Bay','America/Campo_Grande',
  'America/Cancun','America/Caracas','America/Cayenne','America/Cayman','America/Chicago','America/Chihuahua','America/Costa_Rica',
  'America/Creston','America/Cuiaba','America/Curacao','America/Danmarkshavn','America/Dawson','America/Dawson_Creek',
  'America/Denver','America/Detroit','America/Dominica','America/Edmonton','America/Eirunepe','America/El_Salvador',
  'America/Fort_Nelson','America/Fortaleza','America/Glace_Bay','America/Godthab','America/Goose_Bay','America/Grand_Turk',
  'America/Grenada','America/Guadeloupe','America/Guatemala','America/Guayaquil','America/Guyana','America/Halifax',
  'America/Havana','America/Hermosillo','America/Indiana/Indianapolis','America/Indiana/Knox','America/Indiana/Marengo',
  'America/Indiana/Petersburg','America/Indiana/Tell_City','America/Indiana/Vevay','America/Indiana/Vincennes','America/Indiana/Winamac',
  'America/Inuvik','America/Iqaluit','America/Jamaica','America/Juneau','America/Kentucky/Louisville','America/Kentucky/Monticello',
  'America/Kralendijk','America/La_Paz','America/Lima','America/Los_Angeles','America/Lower_Princes','America/Maceio',
  'America/Managua','America/Manaus','America/Marigot','America/Martinique','America/Matamoros','America/Mazatlan','America/Menominee',
  'America/Merida','America/Metlakatla','America/Mexico_City','America/Miquelon','America/Moncton','America/Monterrey',
  'America/Montevideo','America/Montserrat','America/Nassau','America/New_York','America/Nipigon','America/Nome','America/Noronha',
  'America/North_Dakota/Beulah','America/North_Dakota/Center','America/North_Dakota/New_Salem','America/Ojinaga',
  'America/Panama','America/Pangnirtung','America/Paramaribo','America/Phoenix','America/Port-au-Prince','America/Port_of_Spain',
  'America/Porto_Velho','America/Puerto_Rico','America/Punta_Arenas','America/Rainy_River','America/Rankin_Inlet',
  'America/Recife','America/Regina','America/Resolute','America/Rio_Branco','America/Santarem','America/Santiago','America/Santo_Domingo',
  'America/Sao_Paulo','America/Scoresbysund','America/Sitka','America/St_Barthelemy','America/St_Johns','America/St_Kitts',
  'America/St_Lucia','America/St_Thomas','America/St_Vincent','America/Swift_Current','America/Tegucigalpa','America/Thule',
  'America/Thunder_Bay','America/Tijuana','America/Toronto','America/Tortola','America/Vancouver','America/Whitehorse',
  'America/Winnipeg','America/Yakutat','America/Yellowknife',
  'Antarctica/Casey','Antarctica/Davis','Antarctica/DumontDUrville','Antarctica/Macquarie','Antarctica/Mawson','Antarctica/McMurdo',
  'Antarctica/Palmer','Antarctica/Rothera','Antarctica/Syowa','Antarctica/Troll','Antarctica/Vostok',
  'Arctic/Longyearbyen',
  'Asia/Aden','Asia/Almaty','Asia/Amman','Asia/Anadyr','Asia/Aqtau','Asia/Aqtobe','Asia/Ashgabat','Asia/Atyrau','Asia/Baghdad',
  'Asia/Bahrain','Asia/Baku','Asia/Bangkok','Asia/Barnaul','Asia/Beirut','Asia/Bishkek','Asia/Brunei','Asia/Chita','Asia/Choibalsan',
  'Asia/Colombo','Asia/Damascus','Asia/Dhaka','Asia/Dili','Asia/Dubai','Asia/Dushanbe','Asia/Famagusta','Asia/Gaza','Asia/Hebron',
  'Asia/Ho_Chi_Minh','Asia/Hong_Kong','Asia/Hovd','Asia/Irkutsk','Asia/Jakarta','Asia/Jayapura','Asia/Jerusalem','Asia/Kabul',
  'Asia/Kamchatka','Asia/Karachi','Asia/Kathmandu','Asia/Khandyga','Asia/Kolkata','Asia/Krasnoyarsk','Asia/Kuala_Lumpur','Asia/Kuching',
  'Asia/Kuwait','Asia/Macau','Asia/Magadan','Asia/Makassar','Asia/Manila','Asia/Muscat','Asia/Nicosia','Asia/Novokuznetsk',
  'Asia/Novosibirsk','Asia/Omsk','Asia/Oral','Asia/Phnom_Penh','Asia/Pontianak','Asia/Pyongyang','Asia/Qatar','Asia/Qostanay','Asia/Qyzylorda',
  'Asia/Riyadh','Asia/Sakhalin','Asia/Samarkand','Asia/Seoul','Asia/Shanghai','Asia/Singapore','Asia/Srednekolymsk','Asia/Taipei',
  'Asia/Tashkent','Asia/Tbilisi','Asia/Tehran','Asia/Thimphu','Asia/Tokyo','Asia/Tomsk','Asia/Ulaanbaatar','Asia/Urumqi','Asia/Ust-Nera',
  'Asia/Vladivostok','Asia/Yakutsk','Asia/Yangon','Asia/Yekaterinburg','Asia/Yerevan',
  'Atlantic/Azores','Atlantic/Bermuda','Atlantic/Canary','Atlantic/Cape_Verde','Atlantic/Faroe','Atlantic/Madeira','Atlantic/Reykjavik',
  'Atlantic/South_Georgia','Atlantic/St_Helena','Atlantic/Stanley',
  'Australia/Adelaide','Australia/Brisbane','Australia/Broken_Hill','Australia/Darwin','Australia/Eucla','Australia/Hobart',
  'Australia/Lindeman','Australia/Lord_Howe','Australia/Melbourne','Australia/Perth','Australia/Sydney',
  'Europe/Amsterdam','Europe/Andorra','Europe/Astrakhan','Europe/Athens','Europe/Belgrade','Europe/Berlin','Europe/Brussels',
  'Europe/Bucharest','Europe/Budapest','Europe/Busingen','Europe/Chisinau','Europe/Copenhagen','Europe/Dublin','Europe/Gibraltar',
  'Europe/Guernsey','Europe/Helsinki','Europe/Isle_of_Man','Europe/Istanbul','Europe/Jersey','Europe/Kaliningrad','Europe/Kiev',
  'Europe/Kirov','Europe/Lisbon','Europe/Ljubljana','Europe/London','Europe/Luxembourg','Europe/Madrid','Europe/Malta','Europe/Mariehamn',
  'Europe/Minsk','Europe/Monaco','Europe/Moscow','Europe/Oslo','Europe/Paris','Europe/Podgorica','Europe/Prague','Europe/Riga',
  'Europe/Rome','Europe/Samara','Europe/San_Marino','Europe/Sarajevo','Europe/Saratov','Europe/Simferopol','Europe/Skopje','Europe/Sofia',
  'Europe/Stockholm','Europe/Tallinn','Europe/Tirane','Europe/Ulyanovsk','Europe/Uzhgorod','Europe/Vaduz','Europe/Vatican','Europe/Vienna',
  'Europe/Vilnius','Europe/Volgograd','Europe/Warsaw','Europe/Zagreb','Europe/Zaporozhye','Europe/Zurich',
  'Indian/Antananarivo','Indian/Chagos','Indian/Christmas','Indian/Cocos','Indian/Comoro','Indian/Kerguelen','Indian/Mahe','Indian/Maldives',
  'Indian/Mauritius','Indian/Mayotte','Indian/Reunion',
  'Pacific/Apia','Pacific/Auckland','Pacific/Bougainville','Pacific/Chatham','Pacific/Chuuk','Pacific/Easter','Pacific/Efate','Pacific/Enderbury',
  'Pacific/Fakaofo','Pacific/Fiji','Pacific/Funafuti','Pacific/Galapagos','Pacific/Gambier','Pacific/Guadalcanal','Pacific/Guam',
  'Pacific/Honolulu','Pacific/Johnston','Pacific/Kiritimati','Pacific/Kosrae','Pacific/Kwajalein','Pacific/Majuro','Pacific/Marquesas',
  'Pacific/Midway','Pacific/Nauru','Pacific/Niue','Pacific/Norfolk','Pacific/Noumea','Pacific/Pago_Pago','Pacific/Palau','Pacific/Pitcairn',
  'Pacific/Pohnpei','Pacific/Port_Moresby','Pacific/Rarotonga','Pacific/Saipan','Pacific/Tahiti','Pacific/Tarawa','Pacific/Tongatapu',
  'Pacific/Wake','Pacific/Wallis'
];

export default function WorkTEditModal({ timing, onClose, onSave }) {
  const [name, setName] = useState('');
  const [branchId, setBranchId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedDays, setSelectedDays] = useState([]); // 0=SUN, 1=MON, ..., 6=SAT
  const [timeZone, setTimeZone] = useState('Africa/Cairo');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // language subscription for re-render when toggled
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);

  // Days mapping (use translations so English/Arabic switch works)
  const DAYS = [
    { key: 'DAY_SUN', shortKey: 'SUN_SHORT', value: 0 },
    { key: 'DAY_MON', shortKey: 'MON_SHORT', value: 1 },
    { key: 'DAY_TUE', shortKey: 'TUE_SHORT', value: 2 },
    { key: 'DAY_WED', shortKey: 'WED_SHORT', value: 3 },
    { key: 'DAY_THU', shortKey: 'THU_SHORT', value: 4 },
    { key: 'DAY_FRI', shortKey: 'FRI_SHORT', value: 5 },
    { key: 'DAY_SAT', shortKey: 'SAT_SHORT', value: 6 }
  ].map(d => ({
    label: `${_t(d.key)} (${_t(d.shortKey)})`,
    short: _t(d.shortKey),
    value: d.value
  }));

  // Convert time from API format (HH:MM:SS) to input format (HH:MM)
  const timeToInput = (t) => {
    if (!t) return '';
    const s = String(t).trim();
    const match = s.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}`;
    }
    return '';
  };

  // Convert time from input format (HH:MM) to API format (HH:MM:SS)
  const inputToTime = (t) => {
    if (!t) return '';
    const s = String(t).trim();
    const match = s.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}:00`;
    }
    return t;
  };

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchBranches();
        setBranches(data);
      } catch (err) {
        }
    };
    loadBranches();
  }, []);

  useEffect(() => {
    if (!timing) return;
    setName(timing.name ?? '');
    setBranchId(timing.branchId ?? null);
    // Convert API time format to input format (HH:MM)
    setStart(timeToInput(timing.start));
    setEnd(timeToInput(timing.end));
    setTimeZone(timing.timeZone ?? 'Africa/Cairo');
    
    // Convert API days to internal format (0-6)
    // If API uses 7 for Sunday, convert to 0; otherwise use as-is
    setSelectedDays(
      Array.isArray(timing.selectedDays)
        ? timing.selectedDays.map((d) => (d === 7 ? 0 : d))
        : []
    );
    setError(null);
  }, [timing]);

  const toggleDay = (val) => {
    setSelectedDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val].sort((a, b) => a - b)
    );
  };

  const handleSave = async () => {
    setError(null);
    if (!name) return setError(_t('NAME') + ' ' + _t('CANCEL')); // minimal feedback - reused keys
    if (!branchId) return setError(_t('SELECT_A_BRANCH'));
    if (!start || !end) return setError(_t('START_TIME') + ' / ' + _t('END_TIME'));

    // Convert internal days (0=SUN,...,6=SAT) to API expected values.
    // Many APIs accept 1..7 with Sunday=7; Postman payload used 1..5 and succeeded.
    // Map 0 -> 7, leave others unchanged so Monday..Saturday remain 1..6.
    const apiSelectedDays = selectedDays.map((d) => (d === 0 ? 7 : d));

    const payload = {
      ...(timing?.id ? { id: timing.id } : {}),
      branchId: Number(branchId),
      name: String(name),
      start: inputToTime(start), // Convert HH:MM to HH:MM:SS
      end: inputToTime(end), // Convert HH:MM to HH:MM:SS
      selectedDays: apiSelectedDays, // mapped for API (Sunday -> 7)
      timeZone: timeZone || 'Africa/Cairo'
    };

    // Log the outgoing payload so you can inspect it in the console before the API call
    setIsSaving(true);
    try {
      const updated = timing?.id ? await updateShift(payload) : await createShift(payload);
      onSave(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save shift');
    } finally {
      setIsSaving(false);
    }
  };

  // ensure current timeZone exists in the list (append if custom)
  useEffect(() => {
    if (timeZone && !TIMEZONES.includes(timeZone)) {
      TIMEZONES.push(timeZone);
    }
  }, [timeZone]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={22} />
        </button>

        <h3 className="text-xl font-semibold mb-4">{timing?.id ? _t('EDIT_SHIFT') : _t('ADD_SHIFT')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">{_t('NAME')}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              placeholder={_t('NAME')}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">{_t('BRANCH')}</label>
            <select
              value={branchId || ''}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="" disabled>
                {_t('SELECT_A_BRANCH')}
              </option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">{_t('START_TIME')}</label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full mt-2 p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="HH:MM"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">{_t('END_TIME')}</label>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full mt-2 p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="HH:MM"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">{_t('TIME_ZONE')}</label>

            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">{_t('SELECT_A_BRANCH')}</option>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">{_t('SELECT_WORKING_DAYS')}</div>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <label
                key={d.value}
                className={`px-3 py-1 rounded-lg border ${
                  selectedDays.includes(d.value)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-200'
                } cursor-pointer`}
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(d.value)}
                  onChange={() => toggleDay(d.value)}
                  className="hidden"
                />
                <span className="text-sm">{d.short}</span>
                <span className="text-xs block opacity-70">{d.label.replace(` (${d.short})`, '')}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded">
            {_t('CANCEL')}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded flex items-center gap-2"
          >
            {isSaving ? _t('SAVING') : <><Save size={16} /> {timing?.id ? _t('SAVE') : _t('SAVE')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}