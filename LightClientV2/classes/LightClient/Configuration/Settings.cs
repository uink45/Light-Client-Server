﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LightClientV2
{
    public class Settings
    {
        private string serverUrl;
        private string lightClientApiUrl;
        private int network;
        
        public Settings()
        {

            serverUrl = "http://127.0.0.1:9596";
            lightClientApiUrl = "http://localhost:2300";
            network = 0;
        }

        public string ServerUrl { get { return serverUrl; } set { serverUrl = value; } }
        public string LightClientApiUrl { get { return lightClientApiUrl; } set { lightClientApiUrl = value; } }
        public int Network { get { return network; } set { network = value; } }

    }
}
