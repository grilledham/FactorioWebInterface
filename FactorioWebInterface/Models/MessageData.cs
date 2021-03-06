﻿namespace FactorioWebInterface.Models
{
    public enum MessageType
    {
        Output,
        Wrapper,
        Control,
        Status,
        Discord,
        Error
    }

    public class MessageData
    {
        public string ServerId { get; set; } = default!;
        public MessageType MessageType { get; set; }
        public string Message { get; set; } = default!;
    }
}
