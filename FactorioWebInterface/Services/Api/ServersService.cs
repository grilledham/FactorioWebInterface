using FactorioWebInterface.Models;
using FactorioWebInterface.Models.Api;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioWebInterface.Services.Api
{
    public interface IServersService
    {
        Task<IEnumerable<ServerDetails>> GetAll();
        Task<IEnumerable<ServerDetails>> GetOnline();
    }
    public class ServersService : IServersService
    {
        private readonly IFactorioServerDataService _factorioServerDataService;

        public ServersService(IFactorioServerDataService factorioServerDataService)
        {
            _factorioServerDataService = factorioServerDataService;
        }

        public async Task<IEnumerable<ServerDetails>> GetAll()
        {
            var serverDetails = new ServerDetails[_factorioServerDataService.ServerCount];
            int index = 0;

            foreach (var server in _factorioServerDataService.Servers.Values)
            {
                if (server.Status == Shared.FactorioServerStatus.Running)
                {
                    serverDetails[index++] = await MakeOnline(server);
                }
                else
                {
                    serverDetails[index++] = MakeOffline(server);
                }
            }

            return serverDetails;
        }

        public async Task<IEnumerable<ServerDetails>> GetOnline()
        {
            var serverDetails = new List<ServerDetails>();

            foreach (var server in _factorioServerDataService.Servers.Values)
            {
                if (server.Status == Shared.FactorioServerStatus.Running)
                {
                    var serverDetail = await MakeOnline(server);
                    serverDetails.Add(serverDetail);
                }
            }

            return serverDetails;
        }

        private static async Task<ServerDetails> MakeOnline(FactorioServerData data)
        {
            return await data.LockAsync(md =>
            {
                return new ServerDetails()
                {
                    Id = md.ServerId,
                    Name = md.ServerRunningSettings?.Name ?? "",
                    Version = md.Version,
                    IsOnline = true,
                    OnlinePlayerCount = md.OnlinePlayerCount,
                    OnlinePlayers = GetOnlinePlayers(md.OnlinePlayers)
                };
            });
        }

        private static ServerDetails MakeOffline(FactorioServerData data)
        {
            return new ServerDetails()
            {
                Id = data.ServerId,
                Name = "",
                Version = data.Version,
                IsOnline = false,
                OnlinePlayerCount = 0,
                OnlinePlayers = Enumerable.Empty<string>()
            };
        }

        private static IEnumerable<string> GetOnlinePlayers(SortedList<string, int> players)
        {
            var list = new List<string>();

            foreach (var entry in players)
            {
                for (int i = 0; i < entry.Value; i++)
                {
                    list.Add(entry.Key);
                }
            }

            return list;
        }
    }
}
