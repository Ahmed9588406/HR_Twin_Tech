import React, { useState, useEffect } from 'react';
import { DollarSign, Gift, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchFinancialData, getCount } from './finantial_api';
import { t as _t, getLang as _getLang } from '../../i18n/i18n';

export default function PayrollDashboard({ selectedMonth }) {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [totalNetPay, setTotalNetPay] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lang = _getLang();
  const isRtl = lang === 'ar';

  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        setLoading(true);

        // Fetch financial data and count data with month filter
        const [data, countData] = await Promise.all([
          fetchFinancialData(selectedMonth), 
          getCount(selectedMonth)
        ]);
        console.log('Fetched financial data:', data);
        console.log('Fetched count data:', countData);

        setEmployees(data);

        // Use count data for totals
        setTotalNetPay(countData.totalNetPay);
        setTotalRewards(countData.totalReward);
        setTotalDiscounts(countData.totalDiscount);
      } catch (err) {
        console.error('API fetch failed, using fallback data:', err);

        // Fallback to hardcoded data if API fails
        const fallbackEmployees = [
          {
            code: 1,
            name: "Abdulrahman Ahmed",
            totalDays: 26,
            totalHours: 208.0,
            salary: 8000.0,
            reward: 0.0,
            discount: 0.0,
            attendanceSalary: 3369.23,
            totalSalary: 3384.62,
            data: null,
            contentType: null,
          },
          {
            code: 2,
            name: "Caroline",
            totalDays: 26,
            totalHours: 208.0,
            salary: 4000.0,
            reward: 0.0,
            discount: 73.08,
            attendanceSalary: 1610.26,
            totalSalary: 1619.23,
            data: null,
            contentType: null
          },
          {
            code: 3,
            name: "Habiba Abozaid",
            totalDays: 26,
            totalHours: 208.0,
            salary: 10000.0,
            reward: 0.0,
            discount: 1897.44,
            attendanceSalary: 2333.33,
            totalSalary: 2333.33,
            data: null,
            contentType: null
          },
          {
            code: 4,
            name: "Alaa Mousa",
            totalDays: 26,
            totalHours: 208.0,
            salary: 8000.0,
            reward: 0.0,
            discount: 788.46,
            attendanceSalary: 2888.46,
            totalSalary: 2288.46,
            data: null,
            contentType: null
          },
          {
            code: 5,
            name: "Jaidaa Ehab",
            totalDays: 26,
            totalHours: 208.0,
            salary: 8000.0,
            reward: 0.0,
            discount: 3347.44,
            attendanceSalary: 1267.95,
            totalSalary: -1808.97,
            data: null,
            contentType: null
          }
        ];
        setEmployees(fallbackEmployees);

        // Fallback totals
        setTotalNetPay(1443.02);
        setTotalRewards(1600.0);
        setTotalDiscounts(1956.98);

        setError('Using fallback data due to API error.');
      } finally {
        setLoading(false);
      }
    };

    loadFinancialData();
  }, [selectedMonth]);

  // Map payroll employee to Employee_profile format (matching EmployeeCard)
  const toProfileEmployee = (emp) => ({
    name: emp.name,
    code: emp.code,
    role: emp.role || 'Employee',
    department: emp.department || 'General',
    avatar: emp.data ? `data:${emp.contentType};base64,${emp.data}` : "https://i.pravatar.cc/150?img=12",
    checkInTime: emp.checkInTime || '10:00',
    // Map status based on financial data
    status: emp.totalSalary < 0 ? 'Absent' : 'Stay here'
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{_t('LOADING')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{_t('ERROR_LOADING_DATA')}</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{_t('NET_PAY')}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">{_t('TOTAL_NET_PAY')}</h3>
          <p className="text-3xl font-bold">{totalNetPay.toFixed(2)} {_t('CURRENCY')}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Gift size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{_t('REWARDS_CARD')}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">{_t('TOTAL_REWARDS')}</h3>
          <p className="text-3xl font-bold">{totalRewards.toFixed(2)} {_t('CURRENCY')}</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingDown size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{_t('DISCOUNTS_CARD')}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">{_t('TOTAL_DISCOUNTS')}</h3>
          <p className="text-3xl font-bold">{totalDiscounts.toFixed(2)} {_t('CURRENCY')}</p>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 ">
                {/* Employee column left-aligned, others centered */}
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">{_t('EMPLOYEE_COL')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('DAYS')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('HOURS')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('SALARY')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('REWARDS_CARD')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('DISCOUNTS_CARD')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('ATTENDANCE')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('TOTAL')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((employee) => (
                <tr
                  key={employee.code}
                  role="button"
                  tabIndex={0}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate('/employee-portal', { state: { employee: toProfileEmployee(employee) } })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/employee-portal', { state: { employee: toProfileEmployee(employee) } });
                    }
                  }}
                >
                  <td className="py-4 px-6 text-left">
                    <div className="flex items-center gap-3">
                      <img
                        src={employee.data ? `data:${employee.contentType};base64,${employee.data}` : "https://i.pravatar.cc/150?img=12"}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                      <span className="font-medium text-gray-900">{employee.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-center">{employee.totalDays}</td>
                  <td className="py-4 px-4 text-gray-600 text-center">{employee.totalHours}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-medium text-gray-900">{employee.salary.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm ml-1">{_t('CURRENCY')}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-center">{employee.reward.toFixed(2)} {_t('CURRENCY')}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={employee.discount > 0 ? "text-rose-600 font-medium" : "text-gray-600"}>
                      {employee.discount.toFixed(2)} {_t('CURRENCY')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900 font-medium text-center">
                    {employee.attendanceSalary.toFixed(2)} {_t('CURRENCY')}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`font-bold ${employee.totalSalary < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {employee.totalSalary.toFixed(2)} {_t('CURRENCY')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}