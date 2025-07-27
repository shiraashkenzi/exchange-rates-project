using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ExchangeController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey = "fca_live_UMhXlXdAn8ctu7RlHKZ1EVOaCgqRwyvOAZ69MoaC";

    public ExchangeController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpGet("currencies")]
    public IActionResult GetCurrencies() =>
        Ok(new[] { "USD", "EUR", "GBP", "CNY", "ILS" });

    [HttpGet]
    public async Task<IActionResult> GetRates([FromQuery] string baseCurrency)
    {
        var response = await _httpClient.GetStringAsync(
            $"https://api.freecurrencyapi.com/v1/latest?apikey={_apiKey}&base_currency={baseCurrency}");
        return Content(response, "application/json");
    }
}