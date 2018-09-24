﻿using FactorioWebInterface.Models;
using FactorioWrapperInterface;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace FactorioWebInterface.Hubs
{
    public class FactorioControlHub : Hub<IFactorioControlClientMethods>, IFactorioControlServerMethods
    {
        private IFactorioServerManager _factorioServerManager;

        public FactorioControlHub(IFactorioServerManager factorioServerManager)
        {
            _factorioServerManager = factorioServerManager;
        }

        public async Task<FactorioContorlClientData> SetServerId(string serverId)
        {
            string connectionId = Context.ConnectionId;
            Context.Items[connectionId] = serverId;

            await Groups.RemoveFromGroupAsync(connectionId, serverId);
            await Groups.AddToGroupAsync(connectionId, serverId);

            var status = await _factorioServerManager.GetStatus(serverId);
            return new FactorioContorlClientData()
            {
                Status = status.ToString()
            };
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string connectionId = Context.ConnectionId;
            if (Context.Items.TryGetValue(connectionId, out object serverId))
            {
                string id = (string)serverId;
                Groups.RemoveFromGroupAsync(connectionId, id);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public Task ForceStop()
        {
            string connectionId = Context.ConnectionId;
            if (Context.Items.TryGetValue(connectionId, out object serverId))
            {
                string id = (string)serverId;
                _factorioServerManager.ForceStop(id);
            }

            return Task.FromResult(0);
        }

        public async Task<string> GetStatus()
        {
            string connectionId = Context.ConnectionId;
            if (Context.Items.TryGetValue(connectionId, out object serverId))
            {
                string id = (string)serverId;
                var status = await _factorioServerManager.GetStatus(id);
                return status.ToString();
            }
            else
            {
                // todo throw error?
                return FactorioServerStatus.Unknown.ToString();
            }
        }

        public Task Load(string saveFilePath)
        {
            throw new NotImplementedException();
        }

        public Task SendToFactorio(string data)
        {
            string connectionId = Context.ConnectionId;
            if (Context.Items.TryGetValue(connectionId, out object serverId))
            {
                string id = (string)serverId;
                _factorioServerManager.SendToFactorioProcess(id, data);
            }

            return Task.FromResult(0);
        }

        public Task Start()
        {
            string connectionId = Context.ConnectionId;
            if (Context.Items.TryGetValue(connectionId, out object serverId))
            {
                string id = (string)serverId;
                _factorioServerManager.Start(id);
            }

            return Task.FromResult(0);
        }

        public Task Stop()
        {
            string connectionId = Context.ConnectionId;
            if (Context.Items.TryGetValue(connectionId, out object serverId))
            {
                string id = (string)serverId;
                _factorioServerManager.Stop(id);
            }

            return Task.FromResult(0);
        }
    }
}