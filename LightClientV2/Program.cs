using System;
using System.Threading.Tasks;

namespace LightClientV2
{
    public class Program 
    {   
        private static LightClientFunctions Client;
        private static LightClientUtility Utility;
        private static ConsoleInterface UserInterface;
        private static Clock Clock;
        private static Logging Logs;
        private static Server Server;
        private static bool NextSyncCommitteeReady;

        public static void InitializeObjects()
        {
            Client = new LightClientFunctions();
            UserInterface = new ConsoleInterface();
            Utility = new LightClientUtility();
            Clock = new Clock();
            Logs = new Logging();
            Server = new Server();
            NextSyncCommitteeReady = false;
        }

        public static async Task Main(string[] args)
        {
            while (true)
            {
                InitializeObjects();
                UserInterface.Display();
            }
            
            //CheckSyncPeriod();
            //await InitializeLightClient();
            //await FetchUpdates();
        }

        public static async Task InitializeLightClient()
        {
            while (true)
            {
                string checkpointRoot = await Server.FetchCheckpointRoot();
                if(checkpointRoot != null)
                {
                    LightClientSnapshot snapshot = await Server.FetchFinalizedSnapshot(checkpointRoot);
                    if(snapshot != null)
                    {
                        Client.ValidateCheckpoint(snapshot);
                        Logs.SelectLogsType("Info", 2, null);
                        Logs.PrintSnapshot(snapshot);
                        break;
                    }              
                }                   
            }
        }

        public static async Task FetchUpdates()
        {
            while (true)
            {
                try
                {
                    await Task.Delay(11900);
                    if (NextSyncCommitteeReady & CheckSyncPeriod())
                    {
                        LightClientUpdate update = await Server.FetchLightClientUpdate(Clock.CalculateSyncPeriod(0).ToString());
                        if (update != null)
                        {
                            Client.ProcessLightClientUpdate(Client.storage, update, Clock.CalculateSlot(0), new Networks().BeaconChainGenesisRoot);
                            Logs.PrintClientLogs(update);
                        }
                    }
                    else
                    {
                        LightClientUpdate update = await Server.FetchHeader();
                        if (update != null)
                        {
                            Client.ProcessLightClientUpdate(Client.storage, update, Clock.CalculateSlot(0), new Networks().BeaconChainGenesisRoot);
                            Logs.PrintClientLogs(update);
                        }
                    }
                }
                catch (Exception e)
                {
                    Logs.SelectLogsType("Error", 0, e.Message);
                }
            }
        }

        public static bool CheckSyncPeriod()
        {   
            if (Clock.CalculateEpochsInSyncPeriod(0) == 255 & !NextSyncCommitteeReady)
            {
                NextSyncCommitteeReady = true;
                return true;
            }
            else if(Clock.CalculateEpochsInSyncPeriod(0) > 255 & NextSyncCommitteeReady)
            {
                NextSyncCommitteeReady = false;
            }
            return false;
        }
    }
}
