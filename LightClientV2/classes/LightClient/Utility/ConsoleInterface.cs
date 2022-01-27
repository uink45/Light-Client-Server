using Spectre.Console;
using System;
using System.Threading.Tasks;

namespace LightClientV2
{
    public class ConsoleInterface
    {
        private LightClientFunctions Client;
        private Settings Settings;
        private Clock Clock;
        private Logging Logs;
        private Server Server;
        private bool NextSyncCommitteeReady;

        public void InitializeClasses()
        {
            Client = new LightClientFunctions();
            Settings = new Settings();
            Clock = new Clock();
            Logs = new Logging();
            Server = new Server();
            NextSyncCommitteeReady = false;
        }

        public void Display()
        {
            InitializeClasses();

            // Clear Console and display title name
            Console.Clear();
            AnsiConsole.Write(
                new FigletText("Light Client")
                .Alignment(Justify.Center)
                .Color(Color.Gold3_1));


            var specVersion = new Rule("[mediumspringgreen]Spec Version - 1.1.8[/]");
            specVersion.RuleStyle(Style.Parse("mediumspringgreen"));
            specVersion.Alignment = Justify.Center;
            AnsiConsole.Write(specVersion);

            var consensusLayer = new Rule("[mediumspringgreen]Consensus Layer[/]");
            consensusLayer.RuleStyle(Style.Parse("mediumspringgreen"));
            consensusLayer.Alignment = Justify.Center;
            AnsiConsole.Write(consensusLayer);
        }

        public async Task MainMenu()
        {
            // Display Options
            var option = AnsiConsole.Prompt(
                new SelectionPrompt<string>()
                    .Title("\n[mediumspringgreen]SELECT AN OPTION:[/]")
                    .HighlightStyle("3")
                    .MoreChoicesText("[Gold3_1](Move up (▲) and down (▼) to reveal more choices)[/]")
                    .PageSize(3)
                    .AddChoices(new[] {
                        "[mediumspringgreen]Connect (~)[/]", "[red]Configuration (*)[/]", "[red]Help (?)[/]", "[mediumspringgreen]Close (x)[/]"}));
            switch (option)
            {
                case "[mediumspringgreen]Connect (~)[/]":
                    Display();
                    await SelectNetwork();
                    return;
                case "[red]Configuration (*)[/]":
                    return;
                case "[red]Help (?)[/]":
                    return;
                case "[mediumspringgreen]Close (x)[/]":
                     Console.Clear();
                     Environment.Exit(0);  
                    return;
            }
        }

        public async Task SelectNetwork() {
            var option = AnsiConsole.Prompt(
               new SelectionPrompt<string>()
                   .Title("\n[mediumspringgreen]SELECT A NETWORK:[/]")
                   .HighlightStyle("3")
                   .PageSize(3)
                   .AddChoices(new[] {
                        "[mediumspringgreen]Beacon Chain[/]", "[mediumspringgreen]Pyrmont[/]", "[mediumspringgreen]Go Back (<-)[/]"}));

            switch (option)
            {
                case "[mediumspringgreen]Beacon Chain[/]":
                    Settings.Network = 0;
                    await DrawDashboard();
                    await Connect(Settings);
                    return;
                case "[mediumspringgreen]Pyrmont[/]":
                    Settings.Network = 1;
                    await DrawDashboard();
                    await Connect(Settings);
                    return;
                case "[mediumspringgreen]Go Back (<-)[/]":
                    Display();
                    return;
            }
        }

        public async Task Connect(Settings settings)
        {
            //CheckSyncPeriod();
            //await InitializeLightClient(settings);
            //await FetchUpdates(settings);
        }

        public async Task DrawDashboard()
        {
            // Clear console
            Console.Clear();

            // Title message
            AnsiConsole.Write(new Markup("[mediumspringgreen]Press[/] [Gold3_1]BACKSPACE[/] [mediumspringgreen]To Return (<-)[/]"));

            Console.WriteLine();
            // Create a table
            var table = new Table().Expand();

            // Add some columns
            table.AddColumn("[Gold3_1]Network Data[/]".PadLeft((int)(Console.WindowWidth/1.6)));

            table.AddRow(new Markup("[mediumspringgreen]Corgi[/]").Alignment(Justify.Center));

            table.BorderColor(Color.MediumSpringGreen);

            // Render the table to the console
            AnsiConsole.Write(table);
            int num = 0;
            await AnsiConsole.Progress()
                 .AutoRefresh(true)
                .Columns(new ProgressColumn[]
                {
                        new TaskDescriptionColumn(),    // Task description
                        new ProgressBarColumn(), 
                        new RemainingTimeColumn(),

                })
                .StartAsync(async ctx =>
                {
                    // Define tasks
                    var task1 = ctx.AddTask("[mediumspringgreen]Current Slot[/]");
                    task1.MaxValue = 12;
                    while (true)
                    {
                        // Simulate some work
                        await Task.Delay(1000);
                        // Increment
                        task1.Increment(1);
                        if (ctx.IsFinished)
                        {
                            task1.Value = 0;
                            num = 0;
                        }
                        if (Console.KeyAvailable)
                            if (Console.ReadKey(true).Key == ConsoleKey.Backspace)
                            {
                            break;
                            }
                    } 
                });
        }

        public async Task InitializeLightClient(Settings settings)
        {
            Console.Clear();
            while (true)
            {
                string checkpointRoot = await Server.FetchCheckpointRoot(settings.ServerUrl);
                if (checkpointRoot != null)
                {
                    LightClientSnapshot snapshot = await Server.FetchFinalizedSnapshot(settings.ServerUrl, checkpointRoot);
                    if (snapshot != null)
                    {
                        Client.ValidateCheckpoint(snapshot);
                        Logs.SelectLogsType("Info", 2, null);
                        Logs.PrintSnapshot(snapshot);
                        break;
                    }
                }
            }
        }

        public async Task FetchUpdates(Settings settings)
        {
            while (true)
            {
                try
                {
                    await Task.Delay(11900);
                    if (NextSyncCommitteeReady & CheckSyncPeriod())
                    {
                        LightClientUpdate update = await Server.FetchLightClientUpdate(settings.ServerUrl, Clock.CalculateRemainingSyncPeriod(settings.Network).ToString());
                        if (update != null)
                        {
                            Client.ProcessLightClientUpdate(Client.storage, update, Clock.CalculateSlot(settings.Network), new Networks().GenesisRoots[settings.Network]);
                            Logs.PrintClientLogs(update);
                        }
                    }
                    else
                    {
                        LightClientUpdate update = await Server.FetchHeader(settings.ServerUrl, settings.Network);
                        if (update != null)
                        {
                            Client.ProcessLightClientUpdate(Client.storage, update, Clock.CalculateSlot(settings.Network), new Networks().GenesisRoots[settings.Network]);
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

        public bool CheckSyncPeriod()
        {
            if (Clock.CalculateEpochsInSyncPeriod(0) == 255 & !NextSyncCommitteeReady)
            {
                NextSyncCommitteeReady = true;
                return true;
            }
            else if (Clock.CalculateEpochsInSyncPeriod(0) > 255 & NextSyncCommitteeReady)
            {
                NextSyncCommitteeReady = false;
            }
            return false;
        }
    }
}
