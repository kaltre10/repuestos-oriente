/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { 
    Users, 
    ShoppingBag, 
    Eye, 
    TrendingUp, 
    Calendar as CalendarIcon,
    ChevronDown,
    Loader2,
    DollarSign
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import request from '../../utils/request';
import { apiUrl } from '../../utils/utils';
import FormattedPrice from '../../components/FormattedPrice';

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const fetchStats = async (startDate?: string, endDate?: string) => {
        setLoading(true);
        try {
            let url = `${apiUrl}/sales/stats`;
            if (startDate && endDate) {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }
            const response = await request.get(url);
            if (response.data.success) {
                setStats(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        let start = new Date();

        if (timeRange === 'day') {
            start.setHours(0, 0, 0, 0);
        } else if (timeRange === 'week') {
            start.setDate(today.getDate() - 7);
        } else if (timeRange === 'month') {
            start.setMonth(today.getMonth() - 1);
        } else if (timeRange === 'lastMonth') {
            // Primer día del mes pasado
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            // Último día del mes pasado
            const end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
            fetchStats(start.toISOString(), end.toISOString());
            return;
        }

        if (timeRange !== 'custom') {
            fetchStats(start.toISOString(), today.toISOString());
        }
    }, [timeRange]);

    const handleCustomRangeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customRange.start && customRange.end) {
            fetchStats(customRange.start, customRange.end);
            setShowDatePicker(false);
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {trend && (
                    <div className="flex items-center mt-2 text-green-600 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Bienvenido al panel de administración</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        {[
                            { id: 'day', label: 'Día' },
                            { id: 'week', label: 'Semana' },
                            { id: 'month', label: 'Mes' },
                            { id: 'lastMonth', label: 'Mes Pasado' },
                        ].map((range) => (
                            <button
                                key={range.id}
                                onClick={() => setTimeRange(range.id)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                    timeRange === range.id
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className={`flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all ${
                                timeRange === 'custom' ? 'ring-2 ring-red-600' : ''
                            }`}
                        >
                            <CalendarIcon className="w-4 h-4 text-red-600" />
                            Personalizado
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showDatePicker && (
                            <div className="absolute right-0 mt-2 w-72 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-10 animate-in fade-in zoom-in duration-200">
                                <form onSubmit={handleCustomRangeSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Desde</label>
                                        <input
                                            type="date"
                                            value={customRange.start}
                                            onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hasta</label>
                                        <input
                                            type="date"
                                            value={customRange.end}
                                            onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 outline-none"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={() => setTimeRange('custom')}
                                        className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                                    >
                                        Aplicar Rango
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Usuarios Registrados" 
                    value={stats?.usersCount || 0} 
                    icon={Users} 
                    color="bg-blue-50 text-blue-600"
                    trend="+12% este mes"
                />
                <StatCard 
                    title="Ventas Realizadas" 
                    value={stats?.salesCount || 0} 
                    icon={ShoppingBag} 
                    color="bg-orange-50 text-orange-600"
                    trend="+5% esta semana"
                />
                <StatCard 
                    title="Total Ingresos" 
                    value={<FormattedPrice price={stats?.totalRevenue || 0} />} 
                    icon={DollarSign} 
                    color="bg-red-50 text-red-600"
                    trend="+8% esta semana"
                />
                <StatCard 
                    title="Visitas Totales" 
                    value={stats?.visitsCount || 0} 
                    icon={Eye} 
                    color="bg-green-50 text-green-600"
                    trend="+25% hoy"
                />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Ventas en el Tiempo</h2>
                        <p className="text-sm text-gray-500">Resumen de ingresos generados</p>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.salesData || []}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                    }}
                                    minTickGap={30}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                                    }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString([], { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                    formatter={(value: any) => [`$${Number(value || 0).toFixed(2)}`, 'Ventas']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#ef4444" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorAmount)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;