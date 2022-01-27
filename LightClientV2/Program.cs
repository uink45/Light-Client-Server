using System;
using System.Threading.Tasks;

namespace LightClientV2
{
    public class Program 
    {    
        private static ConsoleInterface UserInterface;

        public static async Task Main(string[] args)
        {
            while (true)
            {
                UserInterface = new ConsoleInterface();
                UserInterface.Display();
                await UserInterface.MainMenu();
            }
            
            
        }

        
    }
}
