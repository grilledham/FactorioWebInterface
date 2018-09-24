﻿using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using System.Threading.Tasks;

namespace FactorioWebInterface.Models
{
    public class DiscordBotCommands
    {
        private readonly DiscordBot _discordBot;

        public DiscordBotCommands(DiscordBot discordBot)
        {
            _discordBot = discordBot;

            var c = _discordBot.DiscordClient.GetCommandsNext();
            c.CommandErrored += CommandErrored;
        }

        private async Task CommandErrored(CommandErrorEventArgs e)
        {
            string commandName = e.Command?.Name;
            if (commandName == null)
            {
                var embed = new DiscordEmbedBuilder()
                {
                    Description = $"Unknow command name see ;;help for command information.",
                    Color = DiscordBot.failureColor
                }
                .Build();

                await e.Context.RespondAsync(embed: embed);
            }
            else
            {
                var embed = new DiscordEmbedBuilder()
                {
                    Description = $"Invalid use of {commandName} see ;;help {commandName} for help with this command.",
                    Color = DiscordBot.failureColor
                }
                .Build();

                await e.Context.RespondAsync(embed: embed);
            }
        }

        [Command("ping")]
        [Description("Pings the bot.")]
        [Hidden]
        public async Task Ping(CommandContext ctx)
        {
            var embed = new DiscordEmbedBuilder()
            {
                Title = $"pong in {ctx.Client.Ping}ms",
                Color = DiscordBot.infoColor
            }
            .Build();

            await ctx.RespondAsync(embed: embed);
        }

        [Command("setserver")]
        [RequireUserPermissions(DSharpPlus.Permissions.ManageChannels)]
        [Description("Connects the factorio server to this channel.")]
        public async Task SetServer(CommandContext ctx, [Description("The Factorio server ID eg 7.")] string serverId)
        {
            bool success = await _discordBot.SetServer(serverId, ctx.Channel.Id);
            if (success)
            {
                var embed = new DiscordEmbedBuilder()
                {
                    Description = $"Facotrio server {serverId} has been connected to this channel",
                    Color = DiscordBot.successColor
                }
                .Build();

                await ctx.RespondAsync(embed: embed);
            }
            else
            {
                var embed = new DiscordEmbedBuilder()
                {
                    Description = $"Error connecting the facotrio server {serverId} to this channel",
                    Color = DiscordBot.failureColor
                }
                .Build();

                await ctx.RespondAsync(embed: embed);
            }
        }

        [Command("unset")]
        [RequireUserPermissions(DSharpPlus.Permissions.ManageChannels)]
        [Description("Disconnects the currently connected factorio server from this channel.")]
        public async Task UnSetServer(CommandContext ctx)
        {
            string serverId = await _discordBot.UnSetServer(ctx.Channel.Id);
            if (serverId != null)
            {
                string description = serverId == Constants.AdminChannelID
                    ? $"Admin has been disconnected from this channel"
                    : $"Facotrio server {serverId} has been disconnected from this channel";

                var embed = new DiscordEmbedBuilder()
                {
                    Description = description,
                    Color = DiscordBot.successColor
                }
                .Build();

                await ctx.RespondAsync(embed: embed);
            }
            else
            {
                var embed = new DiscordEmbedBuilder()
                {
                    Description = $"Error disconnecting the facotrio server from this channel",
                    Color = DiscordBot.failureColor
                }
                .Build();

                await ctx.RespondAsync(embed: embed);
            }
        }

        [Command("setadmin")]
        [RequireUserPermissions(DSharpPlus.Permissions.ManageChannels)]
        [Description("Connects the factorio server to this channel.")]
        public async Task SetAdmin(CommandContext ctx)
        {
            bool success = await _discordBot.SetServer(Constants.AdminChannelID, ctx.Channel.Id);
            if (success)
            {
                var embed = new DiscordEmbedBuilder()
                {
                    Description = $"Admin has been connected to this channel",
                    Color = DiscordBot.successColor
                }
                .Build();

                await ctx.RespondAsync(embed: embed);
            }
            else
            {
                var embed = new DiscordEmbedBuilder()
                {
                    Description = $"Error connecting Admin to this channel",
                    Color = DiscordBot.failureColor
                }
                .Build();

                await ctx.RespondAsync(embed: embed);
            }
        }
    }
}