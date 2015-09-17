package importer;




import java.io.File;

import org.apache.commons.io.FileUtils;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.request.UpdateRequest;
import org.apache.solr.common.SolrInputDocument;

import net.sf.json.JSONArray;




public class Importer {

	
	
	
	public static void main(String[] args) {
		
		try{
			
			SolrClient server = new HttpSolrClient("http://localhost:8983/solr/collection1");
			
			File file = new File("/Users/carlos/master-chef/www.exito.com-extract.json");
			
			String content = FileUtils.readFileToString(file);
			
			JSONArray list = JSONArray.fromObject(content);
			
			for(int i = 0; i < list.size(); i++){
				
				String title = list.getJSONObject(i).getString("title");
				String img = list.getJSONObject(i).getString("img");
				String id = img.split("\\.")[0];
				
				SolrInputDocument doc = new SolrInputDocument();
				doc.setField("title", title);
				doc.setField("img", img);
				doc.setField("id", id);
				
				UpdateRequest req = new UpdateRequest();
				req.add(doc);
				req.setCommitWithin(5000);
				req.process(server);
				
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}

	}

}
