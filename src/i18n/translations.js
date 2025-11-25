const translations = {
  en: {
    // General
    BACK: 'Back',
    LOADING: 'Loading...',
    NA: 'N/A',
    TODAY: 'Today',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    SUBMIT: 'Submit',
    UPDATE: 'Update',
    NEXT: 'Next',
    EDIT: 'Edit',
    DELETE: 'Delete',
    ACTIONS: 'Actions',
    SEARCH: 'Search',
    TRANSLATION_TOGGLE: 'Translation',
    LOGOUT: 'Logout',

    // Dashboard / User Profile
    MY_PROFILE: 'My Profile',
    ACTIVE_STATUS: 'Active',
    LOADING_PROFILE: 'Loading profile...',
    ERROR_PROFILE: 'Failed to load detailed profile. Showing basic info.',
    ACTIVE_NOW: 'Active Now',
    LAST_SIGNED_IN: 'Last signed in:',
    ATTENDANCE: 'Attendance',
    LEAVE: 'Leave',
    ABSENCE: 'Absence',
    ON_LEAVE: 'On Leave',
    DAYS_LEFT: 'Days Left',
    ATTENDANCE_RATE: 'Attendance Rate',
    BASED_ON_RECENT: 'Based on recent records',
    GO_TO_DASHBOARD: 'Go to Dashboard',
    NO_EMPLOYEE_DATA: 'No Employee Data',
    BACK_TO_DASHBOARD: 'Back to Dashboard',
    EMPLOYEE_PORTAL: 'Employee Portal',

    // Rewards
    REWARDS_TITLE: 'Rewards',
    REWARDS_SUBTITLE: 'Recent rewards and bonuses',

    // Employee Card
    STAY_HERE: 'Stay here',
    LEFT: 'Left',
    CHECKED_OUT: 'Checked out',
    ON_BREAK: 'On break',
    IN_MEETING: 'In meeting',
    PRESENT: 'Present',
    ABSENT: 'Absent',
    LATE: 'Late',
    CALL: 'Call',
    NOTIFY: 'Notify',
    SEND: 'Send',
    LOCK: 'Lock',
    ARRIVAL: 'Arrival',
    LEAVE: 'Leave',

    // Department
    DEPARTMENT: 'Department',
    EMPLOYEES: 'employees',
    OF_TOTAL: 'of total',

    // Attendance Rate
    OVERALL_RATE: 'Overall Attendance Rate',
    DAY_OFF: 'Day Off',
    ON_TIME: 'On Time',

    // Attendance History
    NO_HISTORY: 'No attendance history available.',
    HISTORY_TITLE: 'Attendance History',
    RECENT_RECORDS: 'Recent attendance records',
    DATE: 'Date',
    CHECK_IN: 'Check In',
    CHECK_OUT: 'Check Out',
    WORKING_HOURS: 'Working Hours',
    STATUS: 'Status',
    SHOWING_RECORDS: 'Showing {{n}} of {{total}} records',
    WEEKEND: 'Weekend',
    HOLIDAY: 'Holiday',

    // Settings - General
    SETTINGS_TITLE: 'Settings',
    SETTINGS_SUBTITLE: 'Manage system settings and preferences',
    TAB_WORKPLACE: 'Work Place',
    TAB_DEPARTMENTS: 'Departments',
    TAB_POSITIONS: 'Positions',
    TAB_SHIFTS: 'Shifts',
    TAB_ATTENDANCE: 'Attendance Profile',

    // Settings - Work Timing
    NAME: 'Name',
    START_TIME: 'Start Time',
    END_TIME: 'End Time',
    BRANCH: 'Branch',
    FREE_DAYS: 'Free Days',
    LOADING_SHIFTS: 'Loading shifts...',
    NO_SHIFTS: 'No shifts found',
    ADD_SHIFT: 'Add Shift',
    // WorkTiming modal specific
    EDIT_SHIFT: 'Edit Shift',
    SELECT_A_BRANCH: 'Select a branch',
    TIME_ZONE: 'Time Zone',
    SELECT_WORKING_DAYS: 'Select working days',
    // Weekday names / shorts
    DAY_SUN: 'Sunday',
    DAY_MON: 'Monday',
    DAY_TUE: 'Tuesday',
    DAY_WED: 'Wednesday',
    DAY_THU: 'Thursday',
    DAY_FRI: 'Friday',
    DAY_SAT: 'Saturday',
    SUN_SHORT: 'SUN',
    MON_SHORT: 'MON',
    TUE_SHORT: 'TUE',
    WED_SHORT: 'WED',
    THU_SHORT: 'THU',
    FRI_SHORT: 'FRI',
    SAT_SHORT: 'SAT',

    // Settings - Attendance
    ATTENDANCE_MGMT: 'Attendance Management',
    ATTENDANCE_MGMT_SUB: 'Monitor and configure company delay settings and attendance profiles',
    COMPANY_DELAY_SETTINGS: 'Company Delay Settings',
    CONFIG_DELAY: 'Configure delay time and hour parameters',
    DELAY_TIME: 'Delay Time',
    MINUTES: 'minutes',
    DELAY_HOURS: 'Delay Hours',
    // added keys:
    DELAY_HOUR: 'Delay Hour',
    TERMINATION_NOTICE_LIMIT: 'Termination Notice Limit',
    TERMINATION_WARNINGS: 'You have {{n}} Termination warning(s).',
    HOURS: 'hours',
    OVERTIME_MINS: 'Overtime Minutes',
    DISCOUNT_PERCENT: 'Discount %',
    OVERTIME_PERCENT: 'Overtime %',
    SAVE_CHANGES: 'Save Changes',
    SAVING: 'Saving...',
    COMPANY: 'Company',
    ID: 'ID',
    BRANCHES: 'Branches',
    CURRENT_LIMIT: 'Current / Limit',
    REMAINING: 'Remaining',

    // Requests
    REQUEST_STATUS: 'Request Status',
    REJECT: 'Reject',
    REJECTING: 'Rejecting...',
    ACCEPT: 'Accept',
    APPROVING: 'Approving...',
    REQUEST_DETAILS: 'Request Details',
    REQUEST_TYPE: 'Request Type',
    REQUEST_DATE: 'Request Date',
    DURATION: 'Duration',
    DAYS: 'Days',
    COMMENT: 'Comment',
    NO_COMMENT: 'No comment provided.',
    ATTACHED_FILES: 'Attached Files',
    DOWNLOAD_DOC: 'Download Document',
    FINANCIAL_DETAILS: 'Financial Details',
    ADVANCE_AMOUNT: 'Advance Amount',
    OVERTIME_AMOUNT: 'OverTime Amount',
    PAID_FROM_COMPANY: 'Paid From Company',
    LOADING_REQUEST: 'Loading request details...',
    NO_REQUEST_DATA: 'No Request Data',
    GO_TO_REQ_DASH: 'Go to Requests Dashboard',
    ACTIVE_EMPLOYEE: 'Active Employee',

    // Create Employee
    PERSONAL_INFO: 'Personal Info',
    WORK_DETAILS: 'Work Details',
    SALARY_ACCESS: 'Salary & Access',
    UPLOAD_PHOTO: 'Upload Photo',
    ENTER_FULL_NAME: 'Enter full name',
    DATE_OF_BIRTH: 'Date Of Birth',
    NUMBER: 'Number',
    ENTER_ID: 'Enter ID number',
    GENDER: 'Gender',
    MALE: 'Male',
    FEMALE: 'Female',
    EMAIL: 'Email',
    ENTER_EMAIL: 'Enter email address',
    SELECT_DEPT: 'Select Department',
    POSITION: 'Position',
    SELECT_POS: 'Select Position',
    SELECT_SHIFT: 'Select Shift',
    SALARY: 'Salary',
    USERNAME: 'Username',
    PASSWORD: 'Password',
    REVIEW_INFO: 'Review Your Information',
    REVIEW_MSG: 'Please review all the information you\'ve entered before submitting the form.',
    CREATING: 'Creating...',
    UPDATING: 'Updating...',
    LOADING_FORM: 'Loading form data...',
    MANAGER: 'Manager',

    // Sidebar & App
    SIDEBAR_DASHBOARD: 'Dashboard',
    SIDEBAR_EMPLOYEES: 'Employees',
    SIDEBAR_REQUESTS: 'Requests',
    SIDEBAR_FINANCIALS: 'Financials',
    SIDEBAR_SETTINGS: 'Settings',
    APP_TITLE: 'HR System',
    APP_SUBTITLE: 'Management Portal',
    TOOLTIP_OPEN_SIDEBAR: 'Open sidebar',
    TOOLTIP_CLOSE_SIDEBAR: 'Close sidebar',
    TOOLTIP_NOTIFICATIONS: 'Notifications',
    TOOLTIP_LOGOUT: 'Logout',
    TOOLTIP_LANGUAGE: 'Language',
    SWITCH_TO_ARABIC: 'Switch to Arabic',
    SWITCH_TO_ENGLISH: 'Switch to English',
    ADMIN: 'Admin',

    // Login
    LOGIN: 'Login',
    LOGGING_IN: 'Logging in... ',
    USERNAME: 'Username',
    PASSWORD: 'Password',
    REMEMBER_ME: 'Remember Me For 356 days',
    WELCOME_BACK: 'Welcome Back',
    WELCOME_SUB: 'To Keep Connected With Us Please Login With Your Personal Info',
    LOGIN_TOKEN_MISSING: 'Login succeeded but token missing in response',
    LOGIN_FAILED: 'Login failed. Please try again.',

    // Notifications
    NOTIFICATIONS: 'Notifications',
    CONNECTING: 'Connecting...',
    RECONNECT: 'Reconnect',
    NO_NOTIFICATIONS: 'No notifications',
    CHECK_BACK: 'Check back later for updates',
    NEW_NOTIFICATION: 'New Notification',
    CLOSE_NOTIFICATIONS: 'Close notifications',
    FROM: 'From',
    CODE: 'Code',
    MARK_ALL_AS_READ: 'Mark all as read',
    DELETE_BTN: 'Delete',
    DELETE_NOTIFICATION: 'Delete notification',
    YOU_HAVE_NEW_NOTIFICATION: 'You have a new notification',
    LIVE_CONNECTED: 'Live - Connected',
    CLICK_TO_RECONNECT: 'Click to reconnect',
    SELECT_ALL: 'Select All',
    DESELECT_ALL: 'Deselect All',
    SELECTED_COUNT: '{{n}} selected',

    // Dashboard & Lists
    EMPLOYEE_ATTENDANCE: 'Employee Attendance',
    VIEW_ALL: 'View All',
    NO_EMPLOYEES_TITLE: 'No employees found for this date',
    NO_EMPLOYEES_SUB: 'Try selecting a different date or adjusting your filters',
    SHOWING_EMPLOYEES: 'Showing {{current}} of {{total}} employees for {{date}}',

    // Relative time
    JUST_NOW: 'Just now',
    AGO_MINUTES: '{{n}}m ago',
    AGO_HOURS: '{{n}}h ago',
    AGO_DAYS: '{{n}}d ago',
    // month names (index 0 = January, 11 = December)
    MONTHS: ['january','february','march','april','may','june','july','august','september','october','november','december'],
    // Filters & Lists
    ALL_STATUS: 'All',
    STATUS_PRESENT: 'Present',
    STATUS_ABSENT: 'Absent',
    STATUS_ON_LEAVE: 'On Leave',
    FILTERS_TITLE: 'Filters',
    PRIMARY: 'Primary',
    ALL_DEPARTMENTS: 'All Departments',
    SEARCH_BY_NAME: 'Search by name...',
    RESET: 'Reset',
    FILTERING_BY: 'Filtering by:',
    FILTER_BY_MONTH: 'Filter by Month',

    // Department widget
    TOTAL: 'Total',
    DEPTS_SHORT: 'depts',
    NO_DEPARTMENT_DATA: 'No department data available',
    LARGEST: 'Largest',
    AVERAGE: 'Average',
    DEPARTMENT_NAME: 'Department Name',
    ENTER_DEPARTMENT_NAME: 'Enter department name',
    SELECT_MANAGER: 'Select Manager',

    // Cards
    EMPLOYEE_SINGULAR: 'Employee',
    DAY_OFF_HOLIDAY: 'Day Off - Holiday'
    ,
    // Common/Error
    ERROR: 'Error',

    // WorkPlace / Settings
    TYPE: 'Type',
    COMPANY: 'Company',
    ACTIONS: 'Actions',
    LATITUDE: 'Latitude',
    LONGITUDE: 'Longitude',
    PLACE_PIN_ON_MAP: 'Place pin on map',
    CLICK_MAP_OR_DRAG: 'Click anywhere on the map or drag the pin',
    // added keys for pin modal
    CLOSE: 'Close',
    SELECTED_COORDINATES: 'Selected Coordinates',
    GET_CURRENT_LOCATION: 'Get Current Location',
    SAVE_LOCATION: 'Save Location',
    GEO_NOT_SUPPORTED: 'Geolocation is not supported by this browser.',
    UNABLE_RETRIEVE_LOCATION: 'Unable to retrieve your location',
    PICK_ON_MAP: 'Pick on map',
    ADD_WORKPLACE: 'Add workplace',
    DELETE_CONFIRM: 'Are you sure you want to delete this item?',
    SELECT_LAT_LNG_REQUIRED: 'Please select valid latitude and longitude',
    FAILED_CREATE_BRANCH: 'Failed to create branch',
    FAILED_DELETE_WORKPLACE: 'Failed to delete workplace',
    LOADING_WORKPLACES: 'Loading workplaces...',
    NO_WORKPLACES: 'No workplaces',
    NO_WORKPLACE_TO_UPDATE: 'No workplace to update.',
    INVALID_LAT_LNG: 'Latitude and longitude must be valid numbers.',
    FAILED_UPDATE_BRANCH: 'Failed to update branch',
    BRANCH_NAME_PLACEHOLDER: 'Branch name',
    GET_CURRENT_LOCATION: 'Get Current Location',

    // Employee Page
    EMPLOYEE_DASHBOARD: 'Employee Dashboard',
    MANAGE_EMPLOYEE_INFO: 'Manage and monitor employee information',
    ADD_EMPLOYEE_BTN: 'Add Employee',
    EMPLOYEE_LOGS: 'Employee Logs',
    WORK_TEAMS: 'Work Teams',
    EMPLOYEES_ACTION: 'Employees Action',
    WORK_TEAMS_PLACEHOLDER: 'Work teams management content goes here...',
    EMPLOYEES_ACTION_PLACEHOLDER: 'Employee actions content goes here...',

    // Financials
    FINANCIALS_DASHBOARD: 'Financials Dashboard',
    FINANCIALS_SUBTITLE: 'Manage salaries, expenses, and budgets',
    TAB_PAYROLL: 'PayRoll',
    TAB_REWARDS: 'Rewards',
    TAB_DISCOUNT: 'Discount',
    TAB_BUDGET: 'Budget',
    SEARCH_FINANCIALS: 'Search financials',
    NO_DATA_FOUND: 'No data found',
    EMPLOYEE_NAME: 'Employee Name',
    SALARY: 'Salary',
    BONUS: 'Bonus',
    TOTAL: 'Total',
    STATUS: 'Status',
    CATEGORY: 'Category',
    AMOUNT: 'Amount',
    DATE: 'Date',
    DEPARTMENT_COL: 'Department',
    ALLOCATED: 'Allocated',
    SPENT: 'Spent',
    REMAINING_COL: 'Remaining',
    ACTIVE: 'Active',
    APPROVED: 'Approved',
    PENDING: 'Pending'
    ,
    // Requests
    REQUESTS_DASHBOARD: 'Requests Dashboard',
    REQUESTS_SUBTITLE: 'Manage employee requests for vacations, advances, and overtime',
    REQUESTS_VACATION: 'Vacation Request',
    REQUESTS_ADVANCE: 'Advance Request',
    REQUESTS_OVERTIME: 'Over Time',
    REQUESTS_LOGS: 'Logs',
    REQUEST_APPROVED: 'Request has been approved',
    REQUEST_REJECTED: 'Request has been rejected',
    APPROVE: 'Approve',

    // Pagination / Logs labels used by logs.jsx
    PAGE: 'Page',
    OF: 'of',
    PREVIOUS: 'Previous',
    PAGINATION_FOOTER: 'Showing page {{page}} of {{totalPages}} ({{total}} total employees)',

    // Work Teams
    WORK_TEAMS_DASHBOARD: 'Work Teams Dashboard',
    WORK_TEAMS_SUBTITLE: 'Manage and monitor work teams information',
    SELECT_WORK_TIMING: 'Select Work Timing',
    NO_DEPARTMENTS_FOUND: 'No departments found',
    ADD_NEW_TEAM: 'Add New Team',
    MANAGERS: 'Managers',
    NUM_OF_EMPLOYEES: 'No. of Employees',
    SEARCH: 'Search',

    // Employee Actions
    EMP_ACTION_DASHBOARD: 'Employees Action Dashboard',
    EMP_ACTION_SUBTITLE: 'Manage and monitor employee actions such as promotions, leaves, and warnings',
    BULK_ACTIONS: 'Bulk Actions',
    SEARCH_ACTIONS_PLACEHOLDER: 'Search by name, department, etc.',
    NO_ACTIONS_FOUND: 'No actions found'
    ,
    // Work Teams actions
    CONFIRM_DELETE_TEAM: 'Are you sure you want to delete this team?',
    FAILED_TO_DELETE_TEAM: 'Failed to delete team',

    // Payroll cards & table
    NET_PAY: 'Net Pay',
    TOTAL_NET_PAY: 'Total Net Pay',
    REWARDS_CARD: 'Rewards',
    TOTAL_REWARDS: 'Total Rewards',
    DISCOUNTS_CARD: 'Discounts',
    TOTAL_DISCOUNTS: 'Total Discounts',
    SEARCH_EMPLOYEES: 'Search employees...',
    EMPLOYEE_COL: 'Employee',
    DAYS: 'Days',
    HOURS: 'Hours'
    ,
    // Generic
    ERROR_LOADING_DATA: 'Error loading data',

    // Requests - Shared
    REQUEST_DATE: 'Request Date',
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
    PAYMENT_DATE: 'Payment Date',
    COMMENT: 'Comment',
    REJECTED: 'Rejected',

    // Requests - Vacation
    LOADING_VACATION_REQUESTS: 'Loading vacation requests...',
    FAILED_LOAD_VACATION_REQUESTS: 'Failed to load vacation requests. Please try again.',

    // Requests - Advance
    LOADING_ADVANCE_REQUESTS: 'Loading advance requests...',
    FAILED_LOAD_ADVANCE_REQUESTS: 'Failed to load advance requests.',
    SEARCH_ADVANCE_REQUESTS: 'Search advance requests...',
    NO_ADVANCE_REQUESTS: 'No advance requests found.',

    // Requests - Overtime
    LOADING_OVERTIME_REQUESTS: 'Loading overtime requests...',
    FAILED_LOAD_OVERTIME_REQUESTS: 'Failed to load overtime requests.',
    SEARCH_OVERTIME_REQUESTS: 'Search overtime requests...',
    NO_OVERTIME_REQUESTS: 'No overtime requests found.'
    ,
    // Financials - Rewards/Discounts
    LOADING_REWARDS: 'Loading rewards...',
    LOADING_DISCOUNTS: 'Loading discounts...',
    TOTAL_APPROVED: 'Total Approved',
    REASON_REWARD: 'Reason for reward',
    REWARD_DATE: 'Reward Date',
    REASON_DISCOUNT: 'Reason for discount',
    DISCOUNT_DATE: 'Discount Date',
    TOTAL_DISCOUNT_AMOUNT: 'Total Discount Amount',
    EDIT_AMOUNT: 'Edit Amount',
    DELETE_REWARD: 'Delete Reward',
    DELETE_DISCOUNT: 'Delete Discount',
    TRY_ADJUST_FILTERS: 'Try adjusting your search or filters',
    FAILED_LOAD_REWARDS: 'Failed to load rewards. Please try again later.',
    CURRENCY: 'EGP',
    EDIT_REWARD_AMOUNT: 'Edit Reward Amount',
    EDIT_DISCOUNT_AMOUNT: 'Edit Discount Amount',
    UPDATE_AMOUNT_DESC: 'Update the {{type}} amount',
    CURRENT_AMOUNT: 'Current Amount',
    NEW_AMOUNT: 'New Amount',
    AMOUNT_PLACEHOLDER: '0.00',
    AMOUNT_DIFFERENCE: '{{prefix}}{{amount}}',
    TRANSACTION_ID: 'Transaction ID',
    AUTH_TOKEN_MISSING: 'Auth token not found; please log in again.',
    UPDATE_FAILED: 'Failed to update {{type}}',
    UPDATE_ERROR: 'Error updating {{type}}',
    CHANGES_APPLIED_IMMEDIATELY: 'Changes will be applied immediately after saving',

    // Requests - Profile Page
    LOADING_REQUEST: 'Loading request...'
    , NO_REQUEST_DATA: 'No request data'
    , GO_TO_REQ_DASH: 'Go to Requests Dashboard'
    , REQUEST_STATUS: 'Request Status'
    , REJECTING: 'Rejecting...'
    , REJECT: 'Reject'
    , APPROVING: 'Approving...'
    , ACCEPT: 'Accept'
    , REQUEST_DETAILS: 'Request Details'
    , REQUEST_TYPE: 'Request Type'
    , DURATION: 'Duration'
    , NO_COMMENT: 'No comment'
    , ATTACHED_FILES: 'Attached Files'
    , DOWNLOAD_DOC: 'Download Document'
    , FINANCIAL_DETAILS: 'Financial Details'
    , ADVANCE_AMOUNT: 'Advance Amount'
    , OVERTIME_AMOUNT: 'Overtime Amount'
    , PAID_FROM_COMPANY: 'Paid from company'
    , ACTIVE_EMPLOYEE: 'Active Employee'
    , EMPLOYEES_ACTION_SUBTITLE: 'Manage and monitor employee actions such as promotions, leaves, and warnings'
    , PAID_VACATION: 'Paid Vacation'
    , UNPAID_VACATION: 'Unpaid Vacation'

    // Bulk Actions modal
    , BULK_ACTIONS_TITLE: 'Bulk Actions'
    , BULK_CHANGE_POSITION: 'Change Position'
    , BULK_CHANGE_DEPARTMENT: 'Change Department'
    , BULK_ADD_REWARD_DISCOUNT: 'Add Reward / Discount'
    , BULK_SEND_VACATION: 'Send Vacation'
    , BULK_ACTIONS_FOOTER: 'Select an action to apply to selected items ({{n}} selected)'

    // Employee Actions - Reward/Discount Form
    , ADD_REWARD_DISCOUNT: 'Add Reward or Discount'
    , ACTION_TYPE: 'Action Type'
    , REWARD: 'Reward'
    , DISCOUNT: 'Discount'
    , SELECT_AMOUNT_TYPE: 'Select Amount Type'
    , SELECT_DAYS_TOTAL: 'Select Days (Total: {{total}} days)'
    , SELECT_HOURS_TOTAL: 'Select Hours (Total: {{total}} hours)'
    , REASON_OPTIONAL: 'Reason (Optional)'
    , AFFECTED_EMPLOYEES: '{{count}} employee(s) will be affected by this change.'
    , SELECT_ACTION_TYPE: 'Please select an action type.'
    , SELECT_AMOUNT_TYPE_ERROR: 'Please select amount type (Amount, Days, or Hours).'
    , ENTER_VALID_AMOUNT: 'Please enter a valid amount.'
    , SELECT_AT_LEAST_ONE_DAY: 'Please select at least one day option.'
    , SELECT_AT_LEAST_ONE_HOUR: 'Please select at least one hour option.'
    , APPLY_ACTION: 'Apply {{action}} ({{count}})'
    , APPLYING: 'Applying...'
    , FAILED_APPLY_REWARD_DISCOUNT: 'Failed to apply reward/discount. Please try again.'

    // Employee Actions - Send Vacation Form
    , SEND_VACATION: 'Send Vacation'
    , AFFECTED_EMPLOYEES_VACATION: '{{count}} employee(s) will be affected by this vacation.'
    , SELECT_START_DATE: 'Please select start date.'
    , SELECT_END_DATE: 'Please select end date.'
    , END_DATE_AFTER_START: 'End date must be after start date.'
    , SENDING: 'Sending...'
    , FAILED_SEND_VACATION: 'Failed to send vacation. Please try again.'

    // Employee Actions - Change Position Form
    , CHANGE_POSITION: 'Change Position'
    , CHANGE_JOB_POSITION_NAME: 'Change Job Position Name'
    , NEW_POSITION: 'New Position'
    , LOADING_POSITIONS: 'Loading positions...'
    , SELECT_POSITION: 'Select a position'
    , AFFECTED_EMPLOYEES_POSITION: '{{count}} employee(s) will be affected by this change.'
    , SELECT_NEW_POSITION: 'Please select a new position.'
    , APPLYING_POSITION: 'Applying...'
    , FAILED_CHANGE_POSITION: 'Failed to change position. Please try again.'

    // Delete Modal
    , DELETE_TRANSACTION: 'Delete Transaction'
    , CONFIRM_DELETION: 'Confirm Deletion'
    , PERMANENT_DELETE_DESCRIPTION: 'This action will permanently delete the selected transaction. This cannot be undone.'
    , TRANSACTION_ID: 'Transaction ID'
    , DELETING: 'Deleting'
    , PERMANENT_ACTION: 'This is a permanent action.'
    , WARNING: 'Warning'

    // Employee Discounts widget
    , DISCOUNTS_TITLE: 'Discounts & Deductions'
    , DISCOUNTS_SUBTITLE: 'Recent discounts and penalties'
    , NA_VALUE: 'N/A'
    , LOADING_DISCOUNTS: 'Loading discounts...'
    , UNABLE_LOAD_DISCOUNTS: 'Unable to load discounts.'
    , NO_DISCOUNTS: 'No discounts available.'
    , TYPE_LABEL: 'Type:'

    // Photo upload
    , FAILED_UPLOAD_PHOTO: 'Failed to upload photo'

    // Requests - Vacation (ensure explicit Arabic for "no vacation requests")
    , NO_VACATION_REQUESTS: 'No vacation requests'
    
    // Request Types
    , VACATION: 'Vacation'
    , ADVANCE: 'Advance'
    , OVER_TIME: 'Over Time'
    , OVERTIME_DATE: 'Overtime Date'
    , OVERTIME_HOURS: 'Overtime Hours'
    , REASON: 'Reason'
    
    // Work Teams - Add/Edit Team
    , EDIT_TEAM: 'Edit Team'
    , CREATE_NEW_TEAM: 'Create New Team'
    , CREATE_TEAM: 'Create Team'
    , UPDATE_TEAM: 'Update Team'
    , TEAM_NAME_REQUIRED: 'Team name is required'
    , MANAGER_NAME_REQUIRED: 'Manager name is required'
    
    // Work Teams Members
    , TEAM_MANAGEMENT: 'Team Management'
    , TEAM_MEMBERS: 'Team Members'
    , NO_CURRENT_MEMBERS: 'No current members'
    , START_ADDING_MEMBERS: 'Start adding members'
    , IMAGE: 'Image'
    , DEPARTMENT: 'Department'
    , POSITION: 'Position'
    , ACTIONS: 'Actions'
    , ADD_NEW_MEMBER: 'Add New Member'
    , CHOOSE_EMPLOYEE: 'Choose Employee'
    , SEARCH_EMPLOYEES: 'Search employees'
    , NO_EMPLOYEES_FOUND: 'No employees found'
    , TRY_DIFFERENT_SEARCH: 'Try a different search'
    , NOT_SPECIFIED: 'Not specified'
    , ADD_MEMBER: 'Add Member'
    , ADDING: 'Adding'
    , CONFIRM_REMOVE_MEMBER: 'Confirm remove member'
    , FAILED_ADD_MEMBER: 'Failed to add member'
    , ERROR_REMOVING_MEMBER: 'Error removing member'
  },
  ar: {
    // General
    BACK: 'رجوع',
    LOADING: 'جار التحميل...',
    NA: 'غير متوفر',
    TODAY: 'اليوم',
    SAVE: 'حفظ',
    CANCEL: 'إلغاء',
    SUBMIT: 'إرسال',
    UPDATE: 'تحديث',
    NEXT: 'التالي',
    EDIT: 'تعديل',
    DELETE: 'حذف',
    ACTIONS: 'إجراءات',
    SEARCH: 'بحث',
    TRANSLATION_TOGGLE: 'الترجمة',
    LOGOUT: 'تسجيل الخروج',

    // Dashboard / User Profile
    MY_PROFILE: 'ملفي الشخصي',
    ACTIVE_STATUS: 'نشط',
    LOADING_PROFILE: 'جاري تحميل الملف الشخصي...',
    ERROR_PROFILE: 'فشل تحميل الملف الشخصي. عرض المعلومات الأساسية.',
    ACTIVE_NOW: 'نشط الآن',
    LAST_SIGNED_IN: 'آخر تسجيل دخول:',
    ATTENDANCE: 'الحضور',
    LEAVE: 'إجازة',
    ABSENCE: 'الغياب',
    ON_LEAVE: 'في إجازة',
    DAYS_LEFT: 'الأيام المتبقية',
    ATTENDANCE_RATE: 'معدل الحضور',
    BASED_ON_RECENT: 'بناءً على السجلات الحديثة',
    GO_TO_DASHBOARD: 'الذهاب للوحة التحكم',
    NO_EMPLOYEE_DATA: 'لا توجد بيانات للموظف',
    BACK_TO_DASHBOARD: 'العودة للوحة التحكم',
    EMPLOYEE_PORTAL: 'بوابة الموظف',

    // Rewards
    REWARDS_TITLE: 'المكافآت',
    REWARDS_SUBTITLE: 'المكافآت والعلاوات الأخيرة',

    // Employee Card
    STAY_HERE: 'متواجد',
    LEFT: 'غادر',
    CHECKED_OUT: 'غادر',
    ON_BREAK: 'في استراحة',
    IN_MEETING: 'في اجتماع',
    PRESENT: 'حاضر',
    ABSENT: 'غائب',
    LATE: 'متأخر',
    CALL: 'اتصال',
    NOTIFY: 'إشعار',
    SEND: 'إرسال',
    LOCK: 'قفل',
    ARRIVAL: 'الوصول',
    LEAVE: 'المغادرة',

    // Department
    DEPARTMENT: 'القسم',
    EMPLOYEES: 'موظفين',
    OF_TOTAL: 'من الإجمالي',

    // Attendance Rate
    OVERALL_RATE: 'معدل الحضور العام',
    DAY_OFF: 'يوم عطلة',
    ON_TIME: 'في الوقت المحدد',

    // Attendance History
    NO_HISTORY: 'لا يوجد سجل حضور.',
    HISTORY_TITLE: 'سجل الحضور',
    RECENT_RECORDS: 'سجلات الحضور الأخيرة',
    DATE: 'التاريخ',
    CHECK_IN: 'تسجيل دخول',
    CHECK_OUT: 'تسجيل خروج',
    WORKING_HOURS: 'ساعات العمل',
    STATUS: 'الحالة',
    SHOWING_RECORDS: 'عرض {{n}} من {{total}} سجل',
    WEEKEND: 'عطلة نهاية أسبوع',
    HOLIDAY: 'عطلة رسمية',

    // Settings - General
    SETTINGS_TITLE: 'الإعدادات',
    SETTINGS_SUBTITLE: 'إدارة إعدادات النظام والتفضيلات',
    TAB_WORKPLACE: 'مكان العمل',
    TAB_DEPARTMENTS: 'الأقسام',
    TAB_POSITIONS: 'المناصب',
    TAB_SHIFTS: 'الورديات',
    TAB_ATTENDANCE: 'ملف الحضور',

    // Settings - Work Timing
    NAME: 'الاسم',
    START_TIME: 'وقت البدء',
    END_TIME: 'وقت الانتهاء',
    BRANCH: 'الفرع',
    FREE_DAYS: 'أيام العطلة',
    LOADING_SHIFTS: 'جاري تحميل الورديات...',
    NO_SHIFTS: 'لا توجد ورديات',
    ADD_SHIFT: 'إضافة وردية',
    // WorkTiming modal specific (Arabic):
    EDIT_SHIFT: 'تعديل الوردية',
    SELECT_A_BRANCH: 'اختر فرعًا',
    TIME_ZONE: 'المنطقة الزمنية',
    SELECT_WORKING_DAYS: 'اختر أيام العمل',
    // Weekday names / shorts (Arabic full names, shorts left as English codes)
    DAY_SUN: 'الأحد',
    DAY_MON: 'الإثنين',
    DAY_TUE: 'الثلاثاء',
    DAY_WED: 'الأربعاء',
    DAY_THU: 'الخميس',
    DAY_FRI: 'الجمعة',
    DAY_SAT: 'السبت',
    SUN_SHORT: 'SUN',
    MON_SHORT: 'MON',
    TUE_SHORT: 'TUE',
    WED_SHORT: 'WED',
    THU_SHORT: 'THU',
    FRI_SHORT: 'FRI',
    SAT_SHORT: 'SAT',

    // Settings - Attendance
    ATTENDANCE_MGMT: 'إدارة الحضور',
    ATTENDANCE_MGMT_SUB: 'مراقبة وتكوين إعدادات التأخير وملفات الحضور',
    COMPANY_DELAY_SETTINGS: 'إعدادات تأخير الشركة',
    CONFIG_DELAY: 'تكوين معلمات وقت وساعة التأخير',
    DELAY_TIME: 'وقت التأخير',
    MINUTES: 'دقيقة',
    DELAY_HOURS: 'ساعات التأخير',
    // added keys (Arabic):
    DELAY_HOUR: 'ساعة التأخير',
    TERMINATION_NOTICE_LIMIT: 'حد إشعارات الفصل',
    TERMINATION_WARNINGS: 'لديك {{n}} تحذير/تحذيرات إنهاء',
    HOURS: 'ساعة',
    OVERTIME_MINS: 'دقائق العمل الإضافي',
    DISCOUNT_PERCENT: 'نسبة الخصم',
    OVERTIME_PERCENT: 'نسبة العمل الإضافي',
    SAVE_CHANGES: 'حفظ التغييرات',
    SAVING: 'جاري الحفظ...',
    COMPANY: 'الشركة',
    ID: 'المعرف',
    BRANCHES: 'الفروع',
    CURRENT_LIMIT: 'الحالي / الحد الأقصى',
    REMAINING: 'المتبقي',

    // Requests
    REQUEST_STATUS: 'حالة الطلب',
    REJECT: 'رفض',
    REJECTING: 'جاري الرفض...',
    ACCEPT: 'قبول',
    APPROVING: 'جاري القبول...',
    REQUEST_DETAILS: 'تفاصيل الطلب',
    REQUEST_TYPE: 'نوع الطلب',
    REQUEST_DATE: 'تاريخ الطلب',
    DURATION: 'المدة',
    DAYS: 'أيام',
    COMMENT: 'تعليق',
    NO_COMMENT: 'لا يوجد تعليق.',
    ATTACHED_FILES: 'الملفات المرفقة',
    DOWNLOAD_DOC: 'تحميل المستند',
    FINANCIAL_DETAILS: 'التفاصيل المالية',
    ADVANCE_AMOUNT: 'مبلغ السلفة',
    OVERTIME_AMOUNT: 'مبلغ العمل الإضافي',
    PAID_FROM_COMPANY: 'مدفوع من الشركة',
    LOADING_REQUEST: 'جاري تحميل تفاصيل الطلب...',
    NO_REQUEST_DATA: 'لا توجد بيانات للطلب',
    GO_TO_REQ_DASH: 'الذهاب للوحة الطلبات',
    ACTIVE_EMPLOYEE: 'موظف نشط',

    // Create Employee
    PERSONAL_INFO: 'المعلومات الشخصية',
    WORK_DETAILS: 'تفاصيل العمل',
    SALARY_ACCESS: 'الراتب والوصول',
    UPLOAD_PHOTO: 'رفع صورة',
    ENTER_FULL_NAME: 'أدخل الاسم الكامل',
    DATE_OF_BIRTH: 'تاريخ الميلاد',
    NUMBER: 'الرقم',
    ENTER_ID: 'أدخل رقم الهوية',
    GENDER: 'الجنس',
    MALE: 'ذكر',
    FEMALE: 'أنثى',
    EMAIL: 'البريد الإلكتروني',
    ENTER_EMAIL: 'أدخل البريد الإلكتروني',
    SELECT_DEPT: 'اختر القسم',
    POSITION: 'المنصب',
    SELECT_POS: 'اختر المنصب',
    SELECT_SHIFT: 'اختر الوردية',
    SALARY: 'الراتب',
    USERNAME: 'اسم المستخدم',
    PASSWORD: 'كلمة المرور',
    REVIEW_INFO: 'مراجعة معلوماتك',
    REVIEW_MSG: 'يرجى مراجعة جميع المعلومات التي أدخلتها قبل إرسال النموذج.',
    CREATING: 'جاري الإنشاء...',
    UPDATING: 'جاري التحديث...',
    LOADING_FORM: 'جاري تحميل بيانات النموذج...',
    MANAGER: 'المدير',

    // Sidebar & App
    SIDEBAR_DASHBOARD: 'لوحة التحكم',
    SIDEBAR_EMPLOYEES: 'الموظفون',
    SIDEBAR_REQUESTS: 'الطلبات',
    SIDEBAR_FINANCIALS: 'المالية',
    SIDEBAR_SETTINGS: 'الإعدادات',
    APP_TITLE: 'نظام الموارد البشرية',
    APP_SUBTITLE: 'بوابة الإدارة',
    TOOLTIP_OPEN_SIDEBAR: 'فتح الشريط الجانبي',
    TOOLTIP_CLOSE_SIDEBAR: 'إغلاق الشريط الجانبي',
    TOOLTIP_NOTIFICATIONS: 'الإشعارات',
    TOOLTIP_LOGOUT: 'تسجيل الخروج',
    TOOLTIP_LANGUAGE: 'اللغة',
    SWITCH_TO_ARABIC: 'التبديل إلى العربية',
    SWITCH_TO_ENGLISH: 'التبديل إلى الإنجليزية',
    ADMIN: 'مسؤول',

    // Login
    LOGIN: 'تسجيل الدخول',
    LOGGING_IN: 'جاري تسجيل الدخول...',
    USERNAME: 'اسم المستخدم',
    PASSWORD: 'كلمة المرور',
    REMEMBER_ME: 'تذكرني لمدة 356 يومًا',
    WELCOME_BACK: 'مرحبًا بعودتك',
    WELCOME_SUB: 'للبقاء على اتصال معنا، يرجى تسجيل الدخول بمعلوماتك الشخصية',
    LOGIN_TOKEN_MISSING: 'تم تسجيل الدخول لكن المعرّف مفقود في الاستجابة',
    LOGIN_FAILED: 'فشل تسجيل الدخول. حاول مرة أخرى.',

    // Notifications
    NOTIFICATIONS: 'الإشعارات',
    CONNECTING: 'جارٍ الاتصال...',
    RECONNECT: 'إعادة الاتصال',
    NO_NOTIFICATIONS: 'لا توجد إشعارات',
    CHECK_BACK: 'تحقق لاحقًا من التحديثات',
    NEW_NOTIFICATION: 'إشعار جديد',
    CLOSE_NOTIFICATIONS: 'إغلاق الإشعارات',
    FROM: 'من',
    CODE: 'الرمز',
    MARK_ALL_AS_READ: 'تمييز الكل كمقروء',
    DELETE_BTN: 'حذف',
    DELETE_NOTIFICATION: 'حذف الإشعار',
    YOU_HAVE_NEW_NOTIFICATION: 'لديك إشعار جديد',
    LIVE_CONNECTED: 'مباشر - متصل',
    CLICK_TO_RECONNECT: 'انقر لإعادة الاتصال',
    SELECT_ALL: 'تحديد الكل',
    DESELECT_ALL: 'إلغاء تحديد الكل',
    SELECTED_COUNT: 'تم تحديد {{n}}',

    // Dashboard & Lists
    EMPLOYEE_ATTENDANCE: 'حضور الموظفين',
    VIEW_ALL: 'عرض الكل',
    NO_EMPLOYEES_TITLE: 'لا يوجد موظفون لهذا التاريخ',
    NO_EMPLOYEES_SUB: 'جرّب تحديد تاريخ مختلف أو تعديل عوامل التصفية',
    SHOWING_EMPLOYEES: 'عرض {{current}} من {{total}} موظفًا بتاريخ {{date}}',

    // Relative time
    JUST_NOW: 'الآن',
    AGO_MINUTES: 'منذ {{n}} دقيقة',
    AGO_HOURS: 'منذ {{n}} ساعة',
    AGO_DAYS: 'منذ {{n}} يوم',
    // month names in Arabic (index 0 = January, 11 = December)
    MONTHS: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'],
    // Filters & Lists
    ALL_STATUS: 'الكل',
    STATUS_PRESENT: 'حاضر',
    STATUS_ABSENT: 'غائب',
    STATUS_ON_LEAVE: 'في إجازة',
    FILTERS_TITLE: 'عوامل التصفية',
    PRIMARY: 'أساسي',
    ALL_DEPARTMENTS: 'جميع الأقسام',
    SEARCH_BY_NAME: 'ابحث بالاسم...',
    RESET: 'إعادة تعيين',
    FILTERING_BY: 'التصفية حسب:',
    FILTER_BY_MONTH: 'تصفية حسب الشهر',

    // Department widget
    TOTAL: 'الإجمالي',
    DEPTS_SHORT: 'أقسام',
    NO_DEPARTMENT_DATA: 'لا توجد بيانات للأقسام',
    LARGEST: 'الأكبر',
    AVERAGE: 'المتوسط',
    DEPARTMENT_NAME: 'اسم القسم',
    ENTER_DEPARTMENT_NAME: 'أدخل اسم القسم',
    SELECT_MANAGER: 'اختر المدير',

    // Cards
    EMPLOYEE_SINGULAR: 'موظف',
    DAY_OFF_HOLIDAY: 'عطلة - إجازة'
    ,
    // Common/Error
    ERROR: 'خطأ',

    // WorkPlace / Settings
    TYPE: 'النوع',
    COMPANY: 'الشركة',
    ACTIONS: 'إجراءات',
    LATITUDE: 'خط العرض',
    LONGITUDE: 'خط الطول',
    PLACE_PIN_ON_MAP: 'ضع علامة على الخريطة',
    CLICK_MAP_OR_DRAG: 'انقر في أي مكان على الخريطة أو اسحب الدبوس',
    // added keys for pin modal (Arabic)
    CLOSE: 'إغلاق',
    SELECTED_COORDINATES: 'الإحداثيات المحددة',
    GET_CURRENT_LOCATION: 'الحصول على الموقع الحالي',
    SAVE_LOCATION: 'حفظ الموقع',
    GEO_NOT_SUPPORTED: 'المتصفح لا يدعم تحديد الموقع الجغرافي.',
    UNABLE_RETRIEVE_LOCATION: 'تعذر استرداد موقعك',
    PICK_ON_MAP: 'اختيار من الخريطة',
    ADD_WORKPLACE: 'إضافة مكان عمل',
    DELETE_CONFIRM: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟',
    SELECT_LAT_LNG_REQUIRED: 'يرجى اختيار خط عرض وخط طول صالحين',
    FAILED_CREATE_BRANCH: 'فشل في إنشاء الفرع',
    FAILED_DELETE_WORKPLACE: 'فشل في حذف مكان العمل',
    LOADING_WORKPLACES: 'جاري تحميل أماكن العمل...',
    NO_WORKPLACES: 'لا توجد أماكن عمل',
    NO_WORKPLACE_TO_UPDATE: 'لا يوجد مكان عمل للتحديث.',
    INVALID_LAT_LNG: 'يجب أن يكون خطا العرض والطول أرقامًا صحيحة.',
    FAILED_UPDATE_BRANCH: 'فشل في تحديث الفرع',
    BRANCH_NAME_PLACEHOLDER: 'اسم الفرع',
    GET_CURRENT_LOCATION: 'الحصول على الموقع الحالي',

    // Employee Page
    EMPLOYEE_DASHBOARD: 'لوحة الموظف',
    MANAGE_EMPLOYEE_INFO: 'إدارة ومراقبة معلومات الموظفين',
    ADD_EMPLOYEE_BTN: 'إضافة موظف',
    EMPLOYEE_LOGS: 'سجلات الموظف',
    WORK_TEAMS: 'فرق العمل',
    EMPLOYEES_ACTION: 'إجراءات الموظفين',
    WORK_TEAMS_PLACEHOLDER: 'يتم عرض محتوى إدارة فرق العمل هنا...',
    EMPLOYEES_ACTION_PLACEHOLDER: 'يتم عرض محتوى إجراءات الموظفين هنا...',

    // Financials
    FINANCIALS_DASHBOARD: 'لوحة المالية',
    FINANCIALS_SUBTITLE: 'إدارة الرواتب والمصاريف والميزانيات',
    TAB_PAYROLL: 'الرواتب',
    TAB_REWARDS: 'المكافآت',
    TAB_DISCOUNT: 'الخصومات',
    TAB_BUDGET: 'الميزانية',
    SEARCH_FINANCIALS: 'ابحث في المالية',
    NO_DATA_FOUND: 'لا توجد بيانات',
    EMPLOYEE_NAME: 'اسم الموظف',
    SALARY: 'الراتب',
    BONUS: 'المكافأة',
    TOTAL: 'الإجمالي',
    STATUS: 'الحالة',
    CATEGORY: 'الفئة',
    AMOUNT: 'المبلغ',
    DATE: 'التاريخ',
    DEPARTMENT_COL: 'القسم',
    ALLOCATED: 'المخصص',
    SPENT: 'المنفق',
    REMAINING_COL: 'المتبقي',
    ACTIVE: 'نشط',
    APPROVED: 'موافق عليه',
    PENDING: 'قيد الانتظار'
    ,
    // Requests
    REQUESTS_DASHBOARD: 'لوحة الطلبات',
    REQUESTS_SUBTITLE: 'إدارة طلبات الموظفين للإجازات والسلف والعمل الإضافي',
    REQUESTS_VACATION: 'طلب إجازة',
    REQUESTS_ADVANCE: 'طلب سلفة',
    REQUESTS_OVERTIME: 'عمل إضافي',
    REQUESTS_LOGS: 'سجلات الطلبات',
    REQUEST_APPROVED: 'تم الموافقة على الطلب',
    REQUEST_REJECTED: 'تم رفض الطلب',
    APPROVE: 'قبول',

    // Pagination / Logs labels used by logs.jsx
    PAGE: 'صفحة',
    OF: 'من',
    PREVIOUS: 'السابق',
    PAGINATION_FOOTER: 'عرض الصفحة {{page}} من {{totalPages}} ({{total}} موظف إجمالي)',

    // Work Teams
    WORK_TEAMS_DASHBOARD: 'لوحة فرق العمل',
    WORK_TEAMS_SUBTITLE: 'إدارة ومراقبة معلومات فرق العمل',
    SELECT_WORK_TIMING: 'اختر توقيت العمل',
    NO_DEPARTMENTS_FOUND: 'No departments found',
    ADD_NEW_TEAM: 'Add New Team',
    MANAGERS: 'المديرون',
    NUM_OF_EMPLOYEES: 'عدد الموظفين',
    SEARCH: 'Search',

    // Employee Actions
    EMP_ACTION_DASHBOARD: 'لوحة إجراءات الموظفين',
    EMP_ACTION_SUBTITLE: 'إدارة ومراقبة إجراءات الموظفين مثل الترقيات والإجازات والإنذارات',
    BULK_ACTIONS: 'إجراءات مجمعة',
    SEARCH_ACTIONS_PLACEHOLDER: 'ابحث بالاسم أو القسم أو غير ذلك',
    NO_ACTIONS_FOUND: 'لا توجد إجراءات'
    ,
    // Work Teams actions
    CONFIRM_DELETE_TEAM: 'هل أنت متأكد أنك تريد حذف هذا الفريق؟',
    FAILED_TO_DELETE_TEAM: 'فشل حذف الفريق',

    // Payroll cards & table
    NET_PAY: 'صافي الدفع',
    TOTAL_NET_PAY: 'إجمالي صافي الدفع',
    REWARDS_CARD: 'المكافآت',
    TOTAL_REWARDS: 'إجمالي المكافآت',
    DISCOUNTS_CARD: 'الخصومات',
    TOTAL_DISCOUNTS: 'إجمالي الخصومات',
    SEARCH_EMPLOYEES: 'ابحث عن الموظفين...',
    EMPLOYEE_COL: 'الموظف',
    DAYS: 'الأيام',
    HOURS: 'الساعات'
    ,
    // Generic
    ERROR_LOADING_DATA: 'حدث خطأ أثناء تحميل البيانات',

    // Requests - Shared
    REQUEST_DATE: 'تاريخ الطلب',
    START_DATE: 'تاريخ البدء',
    END_DATE: 'تاريخ الانتهاء',
    PAYMENT_DATE: 'تاريخ الدفع',
    COMMENT: 'تعليق',
    REJECTED: 'مرفوض',

    // Requests - Vacation
    LOADING_VACATION_REQUESTS: 'جارٍ تحميل طلبات الإجازة...',
    FAILED_LOAD_VACATION_REQUESTS: 'فشل تحميل طلبات الإجازة. يرجى المحاولة مرة أخرى.',

    // Requests - Advance
    LOADING_ADVANCE_REQUESTS: 'جارٍ تحميل طلبات السلف...',
    FAILED_LOAD_ADVANCE_REQUESTS: 'فشل تحميل طلبات السلف.',
    SEARCH_ADVANCE_REQUESTS: 'ابحث في طلبات السلف...',
    NO_ADVANCE_REQUESTS: 'لا توجد طلبات سلف.',

    // Requests - Overtime
    LOADING_OVERTIME_REQUESTS: 'جارٍ تحميل طلبات العمل الإضافي...',
    FAILED_LOAD_OVERTIME_REQUESTS: 'فشل تحميل طلبات العمل الإضافي.',
    SEARCH_OVERTIME_REQUESTS: 'ابحث في طلبات العمل الإضافي...',
    NO_OVERTIME_REQUESTS: 'لا توجد طلبات عمل إضافي.'
    ,
    // Financials - Rewards/Discounts
    LOADING_REWARDS: 'جارٍ تحميل المكافآت...',
    LOADING_DISCOUNTS: 'جارٍ تحميل الخصومات...',
    TOTAL_APPROVED: 'إجمالي المقبول',
    REASON_REWARD: 'سبب المكافأة',
    REWARD_DATE: 'تاريخ المكافأة',
    REASON_DISCOUNT: 'سبب الخصم',
    DISCOUNT_DATE: 'تاريخ الخصم',
    TOTAL_DISCOUNT_AMOUNT: 'إجمالي مبلغ الخصومات',
    EDIT_AMOUNT: 'تعديل المبلغ',
    DELETE_REWARD: 'حذف المكافأة',
    DELETE_DISCOUNT: 'حذف الخصم',
    TRY_ADJUST_FILTERS: 'جرّب تعديل البحث أو عوامل التصفية',
    FAILED_LOAD_REWARDS: 'فشل في تحميل المكافآت. يرجى المحاولة مرة أخرى لاحقًا.',
    CURRENCY: 'جنيه مصري',
    EDIT_REWARD_AMOUNT: 'تعديل مبلغ المكافأة',
    EDIT_DISCOUNT_AMOUNT: 'تعديل مبلغ الخصم',
    UPDATE_AMOUNT_DESC: 'تحديث مبلغ {{type}}',
    CURRENT_AMOUNT: 'المبلغ الحالي',
    NEW_AMOUNT: 'المبلغ الجديد',
    AMOUNT_PLACEHOLDER: '٠٫٠٠',
    AMOUNT_DIFFERENCE: '{{prefix}}{{amount}}',
    TRANSACTION_ID: 'معرف المعاملة',
    AUTH_TOKEN_MISSING: 'لم يتم العثور على رمز المصادقة؛ يرجى تسجيل الدخول مرة أخرى.',
    UPDATE_FAILED: 'فشل تحديث {{type}}',
    UPDATE_ERROR: 'حدث خطأ أثناء تحديث {{type}}',
    CHANGES_APPLIED_IMMEDIATELY: 'سيتم تطبيق التغييرات فور الحفظ',

    // Requests - Profile Page
    LOADING_REQUEST: 'جارٍ تحميل الطلب...'
    , NO_REQUEST_DATA: 'لا توجد بيانات للطلب'
    , GO_TO_REQ_DASH: 'الذهاب إلى لوحة الطلبات'
    , REQUEST_STATUS: 'حالة الطلب'
    , REJECTING: 'جاري الرفض...'
    , REJECT: 'رفض'
    , APPROVING: 'جاري القبول...'
    , ACCEPT: 'قبول'
    , REQUEST_DETAILS: 'تفاصيل الطلب'
    , REQUEST_TYPE: 'نوع الطلب'
    , DURATION: 'المدة'
    , NO_COMMENT: 'لا يوجد تعليق'
    , ATTACHED_FILES: 'الملفات المرفقة'
    , DOWNLOAD_DOC: 'تنزيل المستند'
    , FINANCIAL_DETAILS: 'التفاصيل المالية'
    , ADVANCE_AMOUNT: 'مبلغ السلفة'
    , OVERTIME_AMOUNT: 'مبلغ العمل الإضافي'
    , PAID_FROM_COMPANY: 'مدفوع من الشركة'
    , ACTIVE_EMPLOYEE: 'موظف نشط'
    , EMPLOYEES_ACTION_SUBTITLE: 'إدارة ومراقبة إجراءات الموظفين مثل الترقيات والإجازات والإنذارات'
    , PAID_VACATION: 'إجازة مدفوعة'
    , UNPAID_VACATION: 'إجازة غير مدفوعة'

    // Bulk Actions modal (Arabic)
    , BULK_ACTIONS_TITLE: 'إجراءات مجمعة'
    , BULK_CHANGE_POSITION: 'تغيير المنصب'
    , BULK_CHANGE_DEPARTMENT: 'تغيير القسم'
    , BULK_ADD_REWARD_DISCOUNT: 'إضافة مكافأة / خصم'
    , BULK_SEND_VACATION: 'إرسال إجازة'
    , BULK_ACTIONS_FOOTER: 'اختر إجراءً لتطبيقه على العناصر المحددة ({{n}} محدد)'

    // Employee Actions - Reward/Discount Form
    , ADD_REWARD_DISCOUNT: 'إضافة مكافأة أو خصم'
    , ACTION_TYPE: 'نوع الإجراء'
    , REWARD: 'مكافأة'
    , DISCOUNT: 'خصم'
    , SELECT_AMOUNT_TYPE: 'اختر نوع المبلغ'
    , SELECT_DAYS_TOTAL: 'اختر الأيام (المجموع: {{total}} يوم)'
    , SELECT_HOURS_TOTAL: 'اختر الساعات (المجموع: {{total}} ساعة)'
    , REASON_OPTIONAL: 'السبب (اختياري)'
    , AFFECTED_EMPLOYEES: '{{count}} موظف سيتم التأثير عليهم بهذا التغيير.'
    , SELECT_ACTION_TYPE: 'يرجى اختيار نوع الإجراء.'
    , SELECT_AMOUNT_TYPE_ERROR: 'يرجى اختيار نوع المبلغ (مبلغ، أيام، أو ساعات).'
    , ENTER_VALID_AMOUNT: 'يرجى إدخال مبلغ صالح.'
    , SELECT_AT_LEAST_ONE_DAY: 'يرجى اختيار خيار يوم واحد على الأقل.'
    , SELECT_AT_LEAST_ONE_HOUR: 'يرجى اختيار خيار ساعة واحد على الأقل.'
    , APPLY_ACTION: 'تطبيق {{action}} ({{count}})'
    , APPLYING: 'جاري التطبيق...'
    , FAILED_APPLY_REWARD_DISCOUNT: 'فشل في تطبيق المكافأة/الخصم. يرجى المحاولة مرة أخرى.'

    // Employee Actions - Send Vacation Form
    , SEND_VACATION: 'إرسال إجازة'
    , AFFECTED_EMPLOYEES_VACATION: '{{count}} موظف سيتم التأثير عليهم بهذه الإجازة.'
    , SELECT_START_DATE: 'يرجى اختيار تاريخ البدء.'
    , SELECT_END_DATE: 'يرجى اختيار تاريخ الانتهاء.'
    , END_DATE_AFTER_START: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء.'
    , SENDING: 'جاري الإرسال...'
    , FAILED_SEND_VACATION: 'فشل في إرسال الإجازة. يرجى المحاولة مرة أخرى.'

    // Employee Actions - Change Position Form
    , CHANGE_POSITION: 'تغيير المنصب'
    , CHANGE_JOB_POSITION_NAME: 'تغيير اسم المنصب الوظيفي'
    , NEW_POSITION: 'المنصب الجديد'
    , LOADING_POSITIONS: 'جاري تحميل المناصب...'
    , SELECT_POSITION: 'اختر منصبًا'
    , AFFECTED_EMPLOYEES_POSITION: '{{count}} موظف سيتم التأثير عليهم بهذا التغيير.'
    , SELECT_NEW_POSITION: 'يرجى اختيار منصب جديد.'
    , APPLYING_POSITION: 'جاري التطبيق...'
    , FAILED_CHANGE_POSITION: 'فشل في تغيير المنصب. يرجى المحاولة مرة أخرى.'

    // Delete Modal
    , DELETE_TRANSACTION: 'حذف المعاملة'
    , CONFIRM_DELETION: 'تأكيد الحذف'
    , PERMANENT_DELETE_DESCRIPTION: 'سيؤدي هذا الإجراء إلى حذف المعاملة المحددة نهائيًا. لا يمكن التراجع عن ذلك.'
    , TRANSACTION_ID: 'معرف المعاملة'
    , DELETING: 'جاري الحذف'
    , PERMANENT_ACTION: 'هذا إجراء دائم.'
    , WARNING: 'تحذير'

    // Employee Discounts widget (Arabic)
    , DISCOUNTS_TITLE: 'الخصومات والاستقطاعات'
    , DISCOUNTS_SUBTITLE: 'الخصومات والعقوبات الحديثة'
    , NA_VALUE: 'غير متوفر'
    , LOADING_DISCOUNTS: 'جارٍ تحميل الخصومات...'
    , UNABLE_LOAD_DISCOUNTS: 'تعذر تحميل الخصومات.'
    , NO_DISCOUNTS: 'لا توجد خصومات متاحة.'
    , TYPE_LABEL: 'النوع:'

    // Photo upload
    , FAILED_UPLOAD_PHOTO: 'فشل في رفع الصورة'

    // Requests - Vacation (ensure explicit Arabic for "no vacation requests")
    , NO_VACATION_REQUESTS: 'لا توجد طلبات إجازة'
    
    // Request Types (Arabic)
    , VACATION: 'إجازة'
    , ADVANCE: 'سلفة'
    , OVER_TIME: 'عمل إضافي'
    , OVERTIME_DATE: 'تاريخ العمل الإضافي'
    , OVERTIME_HOURS: 'ساعات العمل الإضافي'
    , REASON: 'السبب'
    
    // Work Teams - Add/Edit Team (Arabic)
    , EDIT_TEAM: 'تعديل الفريق'
    , CREATE_NEW_TEAM: 'إنشاء فريق جديد'
    , CREATE_TEAM: 'إنشاء فريق'
    , UPDATE_TEAM: 'تحديث الفريق'
    , TEAM_NAME_REQUIRED: 'اسم الفريق مطلوب'
    , MANAGER_NAME_REQUIRED: 'اسم المدير مطلوب'
    
    // Work Teams Members (Arabic)
    , TEAM_MANAGEMENT: 'إدارة الفريق'
    , TEAM_MEMBERS: 'أعضاء الفريق'
    , NO_CURRENT_MEMBERS: 'لا يوجد أعضاء حاليون'
    , START_ADDING_MEMBERS: 'ابدأ في إضافة الأعضاء'
    , IMAGE: 'الصورة'
    , DEPARTMENT: 'القسم'
    , POSITION: 'المنصب'
    , ACTIONS: 'الإجراءات'
    , ADD_NEW_MEMBER: 'إضافة عضو جديد'
    , CHOOSE_EMPLOYEE: 'اختر موظف'
    , SEARCH_EMPLOYEES: 'البحث عن الموظفين'
    , NO_EMPLOYEES_FOUND: 'لم يتم العثور على موظفين'
    , TRY_DIFFERENT_SEARCH: 'جرب بحث مختلف'
    , NOT_SPECIFIED: 'غير محدد'
    , ADD_MEMBER: 'إضافة عضو'
    , ADDING: 'جاري الإضافة'
    , CONFIRM_REMOVE_MEMBER: 'تأكيد إزالة العضو'
    , FAILED_ADD_MEMBER: 'فشل في إضافة العضو'
    , ERROR_REMOVING_MEMBER: 'خطأ في إزالة العضو'
  }
};

// --- new named exports to help components use language & update document direction ---
let currentLang = localStorage.getItem('i18nLang') || 'en';

export function t(key) {
  return translations[currentLang] && translations[currentLang][key]
    ? translations[currentLang][key]
    : key;
}

export function setLang(lang) {
  currentLang = lang;
  try {
    localStorage.setItem('i18nLang', lang);
  } catch (e) {
    // ignore storage errors
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}

export function getLang() {
  return currentLang;
}

// ensure initial document direction/lang
if (typeof document !== 'undefined') {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}

export default translations;
