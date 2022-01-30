using Spectre.Console;
using System;
namespace LightClientV2
{
    public class ConsoleInterface
    {
        public void Display()
        {
            // Clear Console and display title name
            Console.Clear();
            AnsiConsole.Write(
                new FigletText("Light Client")
                .Alignment(Justify.Center)
                .Color(Color.Gold3_1));

            //
            var specVersion = new Rule("[Gold3_1]Spec Version - 1.1.8[/]");
            specVersion.Border = BoxBorder.Double;
            specVersion.Alignment = Justify.Center;
            AnsiConsole.Write(specVersion);

            var consensusLayer = new Rule("[Gold3_1]Consensus Layer[/]");
            consensusLayer.Border = BoxBorder.Double;
            consensusLayer.Alignment = Justify.Center;
            AnsiConsole.Write(consensusLayer);

            // Display Options
            var option = AnsiConsole.Prompt(
                new SelectionPrompt<string>()
                    .Title("\nSelect an option")
                    .HighlightStyle("3")
                    .PageSize(3)
                    .AddChoices(new[] {
                        "Connect (~)", "Configuration (*)", "Help (?)", "Close (x)"}));

            switch (option)
            {
                case "Connect (~)":
                    return;
                case "Configuration (*)":
                    return;
                case "Help (?)":
                    return;
                case "Close (x)":
                     System.Environment.Exit(0);  
                    return;
            }


        }


    }
}
