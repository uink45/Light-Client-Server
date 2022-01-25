using System;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace LightClientV2
{
    public class Server
    {
        private HttpClient client;
        private SerializeLightClientUpdate headerUpdate;
        private SerializeSnapshot syncSnapshot;
        private SerializeHeader header;

        public Server()
        {
            client = new HttpClient();
            headerUpdate = new SerializeLightClientUpdate();
            syncSnapshot = new SerializeSnapshot();
            header = new SerializeHeader();
        }


        public async Task<string> FetchCheckpointRoot()
        {
            string url = "http://127.0.0.1:9596/eth/v1/beacon/states/head/finality_checkpoints";
            HttpResponseMessage response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            string result = await response.Content.ReadAsStringAsync();
            return JObject.Parse(result)["data"]["finalized"]["root"].ToString();

        }
 
        public async Task<LightClientSnapshot> FetchFinalizedSnapshot(string checkpointRoot)
        {
            string url = "http://127.0.0.1:9596/eth/v1/lightclient/snapshot/" + checkpointRoot;
                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                string result = await response.Content.ReadAsStringAsync();
                syncSnapshot.SerializeData(result);
                return syncSnapshot.InitializeSnapshot();
        }

        public async Task<LightClientUpdate> FetchHeader()
        {
            string url = "http://127.0.0.1:9596/eth/v1/lightclient/head_update/";

                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                string result = await response.Content.ReadAsStringAsync();

                header.SerializeData(result);
                return header.InitializeHeader();

        }

        public async Task<LightClientUpdate> FetchLightClientUpdate(string syncPeriod)
        {
            string url = "http://127.0.0.1:9596/eth/v1/lightclient/committee_updates?from=" + syncPeriod + "&to=" + syncPeriod;

                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                string result = await response.Content.ReadAsStringAsync();

                headerUpdate.SerializeData(result);
                return headerUpdate.InitializeLightClientUpdate();
        }
    }   
}