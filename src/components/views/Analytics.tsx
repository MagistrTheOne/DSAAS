import { Employee } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface AnalyticsProps {
  employees: Employee[];
}

export function Analytics({ employees }: AnalyticsProps) {
  const data = employees.map(emp => ({
    name: emp.name,
    timeWorked: emp.timeWorked,
    tasksCompleted: emp.tasksCompleted,
    incomeGenerated: emp.incomeGenerated,
    economicSwarm: emp.economicSwarm,
    humanCost: emp.timeWorked * 45, // Estimated $45/hr for human
    aiCost: emp.timeWorked * 3,     // Estimated $3/hr for AI
  }));

  const totalIncome = employees.reduce((acc, emp) => acc + emp.incomeGenerated, 0);
  const totalTasks = employees.reduce((acc, emp) => acc + emp.tasksCompleted, 0);
  const totalHours = employees.reduce((acc, emp) => acc + emp.timeWorked, 0);
  const totalBudget = employees.reduce((acc, emp) => acc + (emp.budgetLimit || 0), 0);
  const totalAiCost = employees.reduce((acc, emp) => acc + (emp.timeWorked * 3), 0);
  const budgetUtilization = totalBudget > 0 ? (totalAiCost / totalBudget) * 100 : 0;

  const skillCounts: Record<string, number> = {};
  employees.forEach(emp => {
    emp.skills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  const skillsData = Object.entries(skillCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-light text-white tracking-tight">Analytics</h2>
        <p className="text-zinc-500 mt-1">Performance overview of your digital workforce</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Total Income</div>
          <div className="text-4xl font-light text-emerald-400">${totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Tasks Completed</div>
          <div className="text-4xl font-light text-white">{totalTasks.toLocaleString()}</div>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Hours Worked</div>
          <div className="text-4xl font-light text-white">{totalHours.toLocaleString()}</div>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Budget Utilized</div>
          <div className="text-4xl font-light text-white">{budgetUtilization.toFixed(1)}%</div>
          <div className="text-xs text-zinc-500 mt-2">${totalAiCost.toLocaleString()} / ${totalBudget.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 h-96">
          <h3 className="text-lg font-medium text-white mb-6">Income Generation by Employee</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
              <YAxis stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{fill: '#222'}} 
                contentStyle={{backgroundColor: '#000', borderColor: '#333', color: '#fff'}}
                itemStyle={{color: '#34d399'}}
              />
              <Bar dataKey="incomeGenerated" fill="#34d399" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 h-96">
          <h3 className="text-lg font-medium text-white mb-6">Tasks vs Hours</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor: '#000', borderColor: '#333', color: '#fff'}}
              />
              <Line yAxisId="left" type="monotone" dataKey="tasksCompleted" stroke="#fff" strokeWidth={2} dot={{r: 4, fill: '#fff'}} activeDot={{r: 6}} />
              <Line yAxisId="right" type="monotone" dataKey="timeWorked" stroke="#52525b" strokeWidth={2} dot={{r: 4, fill: '#52525b'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 h-96">
          <h3 className="text-lg font-medium text-white mb-6">Cost Comparison: AI vs Human Equivalent</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
              <YAxis stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{fill: '#222'}} 
                contentStyle={{backgroundColor: '#000', borderColor: '#333', color: '#fff'}}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="humanCost" name="Human Cost (Est.)" fill="#52525b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="aiCost" name="AI Cost" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 h-96">
          <h3 className="text-lg font-medium text-white mb-6">Most Frequently Used Skills</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillsData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} width={100} />
              <Tooltip 
                cursor={{fill: '#222'}} 
                contentStyle={{backgroundColor: '#000', borderColor: '#333', color: '#fff'}}
              />
              <Bar dataKey="count" name="Employees" fill="#fff" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
