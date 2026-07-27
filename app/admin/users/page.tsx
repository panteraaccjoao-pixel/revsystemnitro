"use client";
import { useState } from "react";
import { Search, Edit2, Ban, Shield, CheckCircle, Trash2, Eye, EyeOff, Save, X } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editBalance, setEditBalance] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if(confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleBlockToggle = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Ativo' ? 'Bloqueado' : 'Ativo' };
      }
      return u;
    }));
    // Se o modal estiver aberto para esse usuário, atualiza o status lá também
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, status: selectedUser.status === 'Ativo' ? 'Bloqueado' : 'Ativo' });
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setEditBalance(user.balance.toString());
    setShowPassword(false);
  };

  const saveUserChanges = () => {
    setUsers(users.map(u => {
      if (u.id === selectedUser.id) {
        return { ...u, balance: parseFloat(editBalance) || 0 };
      }
      return u;
    }));
    setSelectedUser(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 border-b border-white/10 text-zinc-300">
              <tr>
                <th className="px-6 py-4 font-medium">Usuário</th>
                <th className="px-6 py-4 font-medium">Saldo Atual</th>
                <th className="px-6 py-4 font-medium">Total Gasto</th>
                <th className="px-6 py-4 font-medium">Compras</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium flex items-center gap-2">
                          {user.name}
                          {user.role === 'VIP' && <Shield className="w-3 h-3 text-yellow-500" />}
                        </div>
                        <div className="text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-green-400">{formatCurrency(user.balance)}</td>
                  <td className="px-6 py-4 text-zinc-300">{formatCurrency(user.totalSpent)}</td>
                  <td className="px-6 py-4 text-zinc-300">{user.productsBought} unid.</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Ativo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {user.status === 'Ativo' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(user)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Gerenciar Usuário">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleBlockToggle(user.id)} className="p-2 hover:bg-orange-500/20 rounded-lg text-zinc-400 hover:text-orange-500 transition-colors" title={user.status === 'Ativo' ? 'Bloquear' : 'Desbloquear'}>
                        <Ban className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-500 transition-colors" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Nenhum usuário encontrado na busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-red-500" />
                Gerenciar Usuário
              </h3>
              <button onClick={() => setSelectedUser(null)} className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Info Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Nome Completo</label>
                  <div className="text-sm text-white bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    {selectedUser.name}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Endereço de E-mail</label>
                  <div className="text-sm text-white bg-white/5 border border-white/10 rounded-lg px-3 py-2 truncate">
                    {selectedUser.email}
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Senha do Usuário</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={selectedUser.password}
                    readOnly
                    className="w-full pl-3 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-red-400/80 mt-1.5">* O administrador tem permissão de visualizar a senha para suporte.</p>
              </div>

              {/* Financial Section */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-sm font-medium text-zinc-300">Estatísticas da Conta</span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
                    selectedUser.status === 'Ativo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    Status: {selectedUser.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Total Gasto</label>
                    <div className="text-sm text-white font-medium">{formatCurrency(selectedUser.totalSpent)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Produtos Comprados</label>
                    <div className="text-sm text-white font-medium">{selectedUser.productsBought} unidades</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Alterar Saldo (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-green-400 font-medium focus:outline-none focus:border-red-500/50 transition-colors" 
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-between items-center">
              <button 
                onClick={() => handleBlockToggle(selectedUser.id)} 
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedUser.status === 'Ativo' 
                  ? 'text-orange-500 hover:bg-orange-500/10' 
                  : 'text-green-500 hover:bg-green-500/10'
                }`}
              >
                {selectedUser.status === 'Ativo' ? 'Bloquear Acesso' : 'Desbloquear Acesso'}
              </button>
              
              <div className="flex gap-2">
                <button onClick={() => setSelectedUser(null)} className="px-4 py-2 rounded-xl text-zinc-400 hover:bg-white/10 text-sm font-medium">
                  Cancelar
                </button>
                <button onClick={saveUserChanges} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-colors">
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
