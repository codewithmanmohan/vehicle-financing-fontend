import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';

const CustomerList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <AnimatedPage>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-white">Registered Customers</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor user accounts in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white text-sm w-full md:w-80 outline-none" 
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/40 text-gray-300 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-5">Customer Name</th>
                <th className="px-6 py-5">Contact Details</th>
                <th className="px-6 py-5">Professional Info</th>
                <th className="px-6 py-5">Location</th>
                <th className="px-6 py-5">Membership</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-white font-bold">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white mb-1 font-mono text-xs">{user.email}</div>
                    <div className="text-[10px] font-bold text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white capitalize font-medium">{user.employmentType || 'NOT SPECIFIED'}</div>
                    <div className="text-[10px] text-primary font-black uppercase">{user.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{user.address?.city || 'N/A'}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">{user.address?.state || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-mono text-xs">{new Date(user.createdAt).toLocaleDateString()}</div>
                    <div className="text-[10px] text-green-500 font-bold uppercase">Active</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CustomerList;
