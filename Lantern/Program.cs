using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lantern
{
    public class Program
    {
        // Initialization code. Don't use any Avalonia, third-party APIs or any
        // SynchronizationContext-reliant code before AppMain is called: things aren't initialized
        // yet and stuff might break.
        [STAThread]
        public static void Main(string[] args)
        {
            DisplayMessages();
            CreateHostBuilder(args).Build().RunAsync();
            BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);
        }

        // Avalonia configuration, don't remove; also used by visual designer.
        public static AppBuilder BuildAvaloniaApp()
        {
            return AppBuilder.Configure<App>()
                .UsePlatformDetect()
                .LogToTrace();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        public static void DisplayMessages()
        {
            Console.Write("\nRunning light client host at ");
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("https://localhost:5001");
            Console.ForegroundColor = ConsoleColor.White;
            Console.Write(" and ");
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("http://localhost:5000. ");
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("\n\nPlease do not close this window while the light client is running.");
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("\n\nWhen finished using the app, press Ctrl + C (twice) to shut down the hosts.");
        }
    }
}
