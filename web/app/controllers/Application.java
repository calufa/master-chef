package controllers;




import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import play.mvc.Controller;
import play.mvc.Result;
import rabbit.utils.Download;




public class Application extends Controller {




	public static Result search(String query){

		try{
			
			response().setHeader("Access-Control-Allow-Origin", "*"); 
			response().setHeader("Content-Type", "application/json");

			String url = "http://localhost:8983/solr/collection1/select?q=" + query + "&wt=json&rows=50";
			
			System.out.println(url);
			
			JSONObject json = new Download().getJSON(url);
			
			JSONArray results = json.getJSONObject("response").getJSONArray("docs");
			
			return ok(results.toString());

		}catch(Exception e){
			e.printStackTrace();
		}

		return null;

	}

}
