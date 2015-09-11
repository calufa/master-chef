package controllers;





import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import play.mvc.Controller;
import play.mvc.Result;
import rabbit.utils.Download;
import views.html.index;




public class Application extends Controller {




	public static Result index() {
		return ok(index.render());
	}




	public static Result search(String query){

		try{
			
			response().setHeader("Access-Control-Allow-Origin", "*"); 
			response().setHeader("Content-Type", "application/json");

			String url = "http://104.197.48.101:8983/solr/master-chef/select?q=" + query + "&wt=json&rows=50";
			
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
